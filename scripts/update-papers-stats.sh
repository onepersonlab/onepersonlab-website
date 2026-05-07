#!/bin/bash
# Papers Stats Updater
# Ensure ~/.local/bin is in PATH (for jq etc.)
export PATH="$HOME/.local/bin:$PATH"

# Updates citation counts and metadata from Semantic Scholar / OpenAlex / Crossref
# Usage: ./scripts/update-papers-stats.sh [--deploy]

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$REPO_ROOT/src/data"
LOG_DIR="$REPO_ROOT/logs"
mkdir -p "$LOG_DIR"

# Optional Semantic Scholar API key (higher rate limit)
SEMANTIC_KEY="${SEMANTIC_SCHOLAR_API_KEY:-}"
if [ -z "$SEMANTIC_KEY" ]; then
  SEMANTIC_KEY=$(grep "SEMANTIC_SCHOLAR_API_KEY" "$HOME/.openclaw/.env" 2>/dev/null | cut -d'=' -f2 || true)
fi

NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
DEPLOY="${1:-}"

echo "=== Papers Stats Updater ==="
echo "Timestamp: $NOW"
echo ""

# ── Retry helper ──
retry_curl() {
  local url="$1"
  local headers="${2:-}"
  local max_attempts=3
  local delay=2
  for attempt in $(seq 1 $max_attempts); do
    local response
    if [ -n "$headers" ]; then
      response=$(curl -s --connect-timeout 10 --max-time 30 $headers "$url" 2>/dev/null) || true
    else
      response=$(curl -s --connect-timeout 10 --max-time 30 "$url" 2>/dev/null) || true
    fi
    if [ -n "$response" ]; then
      echo "$response"
      return 0
    fi
    if [ $attempt -lt $max_attempts ]; then
      sleep "$delay"
      delay=$((delay * 2))
    fi
  done
  echo "{}"
  return 1
}

# ── Fetch from Semantic Scholar ──
fetch_semantic() {
  local doi_clean="$1"
  local headers=""
  if [ -n "$SEMANTIC_KEY" ]; then
    headers="-H x-api-key:$SEMANTIC_KEY"
  fi
  retry_curl "https://api.semanticscholar.org/graph/v1/paper/DOI:$doi_clean?fields=title,year,authors,venue,citationCount,abstract,externalIds" "$headers"
}

# ── Fetch from OpenAlex ──
fetch_openalex() {
  local doi_clean="$1"
  retry_curl "https://api.openalex.org/works/doi:$doi_clean"
}

# ── Fetch from Crossref ──
fetch_crossref() {
  local doi_clean="$1"
  retry_curl "https://api.crossref.org/works/$doi_clean"
}

# ── Update a papers JSON file ──
update_papers_file() {
  local INPUT_FILE="$1"
  local OUTPUT_FILE="$2"
  local FILE_TYPE="$3"

  echo "--- $FILE_TYPE ---"

  if [ ! -f "$INPUT_FILE" ]; then
    echo "  ✗ Input file not found: $INPUT_FILE"
    return 1
  fi

  local TOTAL
  TOTAL=$(jq '.papers | length' "$INPUT_FILE" 2>/dev/null)
  echo "  Found $TOTAL papers"

  local UPDATED_PAPERS="[]"
  local COUNT=0
  local ERRORS=0

  for i in $(seq 0 $((TOTAL - 1))); do
    COUNT=$((COUNT + 1))
    local PAPER DOI TITLE ORDER
    PAPER=$(jq -c ".papers[$i]" "$INPUT_FILE")
    DOI=$(echo "$PAPER" | jq -r '.doi // empty')
    TITLE=$(echo "$PAPER" | jq -r '.title // empty')
    ORDER=$(echo "$PAPER" | jq -r '.order // 0')

    echo "  [$COUNT/$TOTAL] ${TITLE:0:60}..."

    if [ -z "$DOI" ] || [ "$DOI" = "null" ]; then
      echo "    ⚠️  No DOI, keeping existing data"
      UPDATED_PAPERS=$(echo "$UPDATED_PAPERS" | jq --argjson p "$PAPER" '. + [$p]')
      continue
    fi

    local DOI_CLEAN
    DOI_CLEAN=$(echo "$DOI" | sed 's|https://doi.org/||' | sed 's|doi:||')

    # Try Semantic Scholar
    local SS_DATA
    SS_DATA=$(fetch_semantic "$DOI_CLEAN")

    local NEW_TITLE NEW_YEAR NEW_VENUE NEW_CITATIONS NEW_ABSTRACT NEW_AUTHORS

    if [ -n "$SS_DATA" ] && [ "$SS_DATA" != "{}" ] && ! echo "$SS_DATA" | jq -e '.error' > /dev/null 2>&1; then
      NEW_TITLE=$(echo "$SS_DATA" | jq -r '.title // empty')
      NEW_YEAR=$(echo "$SS_DATA" | jq -r '.year // 0')
      NEW_VENUE=$(echo "$SS_DATA" | jq -r '.venue // empty')
      NEW_CITATIONS=$(echo "$SS_DATA" | jq -r '.citationCount // 0')
      NEW_ABSTRACT=$(echo "$SS_DATA" | jq -r '.abstract // empty' | head -c 200)
      NEW_AUTHORS=$(echo "$SS_DATA" | jq -r '[.authors[].name] | @json' 2>/dev/null || echo "[]")
    fi

    # Fallback: OpenAlex for missing fields
    if [ -z "$NEW_TITLE" ] || [ -z "$NEW_ABSTRACT" ] || [ -z "$NEW_VENUE" ]; then
      local OA_DATA
      OA_DATA=$(fetch_openalex "$DOI_CLEAN")
      if [ -n "$OA_DATA" ] && [ "$OA_DATA" != "{}" ]; then
        [ -z "$NEW_TITLE" ] && NEW_TITLE=$(echo "$OA_DATA" | jq -r '.title // empty')
        [ -z "$NEW_VENUE" ] && NEW_VENUE=$(echo "$OA_DATA" | jq -r '.primary_location.source.display_name // empty')
        [ "$NEW_YEAR" = "0" ] && NEW_YEAR=$(echo "$OA_DATA" | jq -r '.publication_year // 0')
        [ "$NEW_AUTHORS" = "[]" ] && NEW_AUTHORS=$(echo "$OA_DATA" | jq -r '[.authorships[].author.display_name] | @json' 2>/dev/null || echo "[]")
        echo "    → OpenAlex fallback"
      fi
    fi

    # Fallback: Crossref
    if [ -z "$NEW_TITLE" ] || [ -z "$NEW_VENUE" ] || [ "$NEW_YEAR" = "0" ] || [ "$NEW_AUTHORS" = "[]" ]; then
      local CR_DATA
      CR_DATA=$(fetch_crossref "$DOI_CLEAN")
      if [ -n "$CR_DATA" ] && echo "$CR_DATA" | jq -e '.message' > /dev/null 2>&1; then
        [ -z "$NEW_TITLE" ] && NEW_TITLE=$(echo "$CR_DATA" | jq -r '.message.title[0] // empty')
        [ -z "$NEW_VENUE" ] && NEW_VENUE=$(echo "$CR_DATA" | jq -r '.["message"]["container-title"][0] // empty')
        [ "$NEW_YEAR" = "0" ] && NEW_YEAR=$(echo "$CR_DATA" | jq -r '.["message"]["published"]["date-parts"][0][0] // 0')
        echo "    → Crossref fallback"
      fi
    fi

    # Always prefer the manually-specified title from base JSON
    [ -n "$TITLE" ] && [ "$TITLE" != "null" ] && NEW_TITLE="$TITLE"

    local PAPER_OBJ
    PAPER_OBJ=$(jq -n \
      --arg title "$NEW_TITLE" \
      --arg doi "$DOI" \
      --argjson year "${NEW_YEAR:-0}" \
      --arg venue "${NEW_VENUE:-}" \
      --argjson citations "${NEW_CITATIONS:-0}" \
      --arg abstract "${NEW_ABSTRACT:-}" \
      --argjson authors "${NEW_AUTHORS:-[]}" \
      --arg url "https://doi.org/$DOI" \
      --argjson order "${ORDER:-0}" \
      '{
        title: $title,
        doi: $doi,
        year: $year,
        venue: $venue,
        authors: $authors,
        citationCount: $citations,
        abstract: $abstract,
        url: $url
      } + (if $order > 0 then {order: $order} else {} end)')

    echo "    ✓ Citations: ${NEW_CITATIONS:-0}"
    UPDATED_PAPERS=$(echo "$UPDATED_PAPERS" | jq --argjson p "$PAPER_OBJ" '. + [$p]')

    sleep 1  # Rate limit
  done

  # Write output
  jq -n \
    --arg desc "Papers - Updated Stats" \
    --arg source "Semantic Scholar / OpenAlex / Crossref" \
    --arg generated "$NOW" \
    --argjson papers "$UPDATED_PAPERS" \
    '{
      description: $desc,
      source: $source,
      generated_at: $generated,
      paper_count: ($papers | length),
      papers: $papers
    }' > "$OUTPUT_FILE"

  echo "  ✓ $OUTPUT_FILE ($COUNT papers)"
}

# ── Update all paper lists ──
update_papers_file "$DATA_DIR/top-6-papers.json"      "$DATA_DIR/top-6-papers-update.json"      "Top 6 Papers"
update_papers_file "$DATA_DIR/all-papers.json"         "$DATA_DIR/all-papers-update.json"         "All Papers"
update_papers_file "$DATA_DIR/developer-papers.json"   "$DATA_DIR/developer-papers-update.json"   "Developer Papers"

# ── Deploy ──
if [ "$DEPLOY" = "--deploy" ]; then
  echo ""
  echo "--- Deploying ---"
  cd "$REPO_ROOT"
  npm run build 2>&1 | tail -5

  rm -rf /tmp/gh-pages-deploy
  mkdir -p /tmp/gh-pages-deploy
  cp -r dist/* /tmp/gh-pages-deploy/
  cd /tmp/gh-pages-deploy
  git init -q
  git config user.email "onepersonlab@github.com"
  git config user.name "OnePersonLab"
  git add -A
  git commit -m "auto-deploy: papers update $NOW" -q
  git remote add origin "https://github.com/onepersonlab/onepersonlab-website.git"
  git push origin master:gh-pages --force -q 2>&1 || echo "⚠️ Deploy may have failed"
  rm -rf /tmp/gh-pages-deploy
  echo "✓ Deployed"
fi

echo ""
echo "=== Papers Update Complete: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
