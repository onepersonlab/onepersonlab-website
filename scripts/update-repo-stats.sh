#!/bin/bash
# AI Agent Repository Stats Updater
# Ensure ~/.local/bin is in PATH (for jq etc.)
export PATH="$HOME/.local/bin:$PATH"

# Updates both Research and General agent lists from GitHub API
# Usage: ./scripts/update-repo-stats.sh [--deploy]

set -euo pipefail

# Auto-detect repo root (works from any subdirectory)
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$REPO_ROOT/src/data"

# Secrets: try multiple sources
TOKEN="${GITHUB_TOKEN:-}"
if [ -z "$TOKEN" ]; then
  TOKEN=$(grep "GITHUB_TOKEN" "$HOME/.openclaw/.env" 2>/dev/null | cut -d'=' -f2 || true)
fi
if [ -z "$TOKEN" ]; then
  echo "ERROR: GITHUB_TOKEN not found. Set GITHUB_TOKEN env var or add to ~/.openclaw/.env"
  exit 1
fi

NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
TODAY=$(date -u +%Y-%m-%d)
DEPLOY="${1:-}"

echo "=== AI Agent Repository Stats Updater ==="
echo "Repo root: $REPO_ROOT"
echo "Data dir:  $DATA_DIR"
echo "Timestamp: $NOW"
echo ""

# ── Helper: retry curl with backoff ──
retry_curl() {
  local url="$1"
  local max_attempts=3
  local delay=2
  for attempt in $(seq 1 $max_attempts); do
    local response
    response=$(curl -s -H "Authorization: token $TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      --connect-timeout 10 --max-time 30 "$url" 2>/dev/null) || true
    if [ -n "$response" ] && ! echo "$response" | jq -e '.message' > /dev/null 2>&1; then
      echo "$response"
      return 0
    fi
    if [ $attempt -lt $max_attempts ]; then
      echo "  ⚠️  Retry $attempt/$max_attempts in ${delay}s..." >&2
      sleep "$delay"
      delay=$((delay * 2))
    fi
  done
  return 1
}

# ── Update a single list ──
update_list() {
  local LIST_NAME="$1"
  local BASE_LIST="$DATA_DIR/${LIST_NAME}-agent-list.json"
  local UPDATE_LIST="$DATA_DIR/${LIST_NAME}-agent-list-update.json"
  local HISTORY_FILE="$DATA_DIR/${LIST_NAME}-stars-history.json"

  echo "--- Updating: $LIST_NAME ---"

  if [ ! -f "$BASE_LIST" ]; then
    echo "  ✗ Base list not found: $BASE_LIST"
    return 1
  fi

  local REPOS
  REPOS=$(jq -r '.repos[]' "$BASE_LIST" 2>/dev/null) || { echo "  ✗ Failed to parse $BASE_LIST"; return 1; }
  local TOTAL
  TOTAL=$(echo "$REPOS" | wc -l)
  echo "  Found $TOTAL repositories"

  # Init history if needed
  if [ ! -f "$HISTORY_FILE" ]; then
    echo '{}' > "$HISTORY_FILE"
  fi

  local TMPFILE="$UPDATE_LIST.tmp"
  echo '[' > "$TMPFILE"
  local FIRST=true
  local COUNT=0
  local ERRORS=0

  while IFS= read -r REPO; do
    [ -z "$REPO" ] && continue
    COUNT=$((COUNT + 1))
    echo "  [$COUNT/$TOTAL] $REPO"

    local RESPONSE
    if ! RESPONSE=$(retry_curl "https://api.github.com/repos/$REPO"); then
      echo "    ✗ Failed after retries, skipping"
      ERRORS=$((ERRORS + 1))
      continue
    fi

    # Parse safely
    local NAME STARS FORKS UPDATED DESCRIPTION LANGUAGE
    NAME=$(echo "$RESPONSE" | jq -r '.name')
    STARS=$(echo "$RESPONSE" | jq -r '.stargazers_count // 0')
    FORKS=$(echo "$RESPONSE" | jq -r '.forks_count // 0')
    UPDATED=$(echo "$RESPONSE" | jq -r '.updated_at // "unknown"')
    DESCRIPTION=$(echo "$RESPONSE" | jq -r '.description // "No description"' | cut -c1-100)
    LANGUAGE=$(echo "$RESPONSE" | jq -r '.language // "Unknown"')

    # Calculate daily stars from history
    local NEAREST_DATE
    NEAREST_DATE=$(jq -r --arg repo "$REPO" --arg today "$TODAY" \
      '.[$repo] | keys | map(select(. < $today)) | max // empty' "$HISTORY_FILE" 2>/dev/null)

    local DAILY=0
    local CHANGE_LABEL="(first record)"
    if [ -n "$NEAREST_DATE" ] && [ "$NEAREST_DATE" != "null" ]; then
      local NEAREST_STARS
      NEAREST_STARS=$(jq -r --arg repo "$REPO" --arg date "$NEAREST_DATE" \
        '.[$repo][$date].stars // 0' "$HISTORY_FILE" 2>/dev/null)
      local DAYS_DIFF
      DAYS_DIFF=$(( ($(date -d "$TODAY" +%s) - $(date -d "$NEAREST_DATE" +%s)) / 86400 ))
      DAILY=$((STARS - NEAREST_STARS))
      [ "$DAILY" -lt 0 ] && DAILY=0
      if [ "$DAYS_DIFF" -eq 1 ]; then
        CHANGE_LABEL="(1-day change)"
      else
        CHANGE_LABEL="(${DAYS_DIFF}-day change)"
      fi
    fi

    # Append to JSON
    [ "$FIRST" = false ] && echo ',' >> "$TMPFILE"
    FIRST=false

    echo "$RESPONSE" | jq -c \
      --argjson daily "$DAILY" \
      --arg chglbl "$CHANGE_LABEL" \
      '{
        full_name: .full_name,
        name: .name,
        owner: .owner.login,
        description: ((.description // "No description") | .[0:100]),
        language: (.language // "Unknown"),
        stars: .stargazers_count,
        forks: .forks_count,
        weeklyStars: $daily,
        changeLabel: $chglbl,
        updated: .updated_at,
        url: ("https://github.com/" + .full_name)
      }' >> "$TMPFILE"

    # Update history
    jq --arg repo "$REPO" --arg date "$TODAY" --argjson stars "$STARS" \
      '.[$repo][$date] = {"stars": $stars}' \
      "$HISTORY_FILE" > "${HISTORY_FILE}.tmp" && mv "${HISTORY_FILE}.tmp" "$HISTORY_FILE"

    echo "    ✓ Stars: $STARS, Daily: +$DAILY $CHANGE_LABEL"

    # Rate limit: 0.3s between calls (GitHub allows ~5000/hr)
    sleep 0.3
  done <<< "$REPOS"

  echo ']' >> "$TMPFILE"

  # Create final JSON with metadata
  jq -s --arg desc "${LIST_NAME} Agent Repositories" \
       --arg source "GitHub API" \
       --arg generated "$NOW" \
       '.[0] | {
         description: $desc,
         source: $source,
         generated_at: $generated,
         repo_count: length,
         repos: .
       }' "$TMPFILE" > "$UPDATE_LIST"

  rm -f "$TMPFILE"
  echo "  ✓ $LIST_NAME: $COUNT repos processed, $ERRORS errors"
  echo ""
}

# ── Update both lists ──
update_list "Research"
update_list "General"

# ── Deploy if requested ──
if [ "$DEPLOY" = "--deploy" ]; then
  echo "--- Rebuilding and deploying ---"
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
  git commit -m "auto-deploy: repo stats update $NOW" -q
  git remote add origin "https://${TOKEN}@github.com/onepersonlab/onepersonlab-website.git"
  git push origin master:gh-pages --force -q 2>&1 || echo "⚠️ Deploy may have failed"

  rm -rf /tmp/gh-pages-deploy
  echo "✓ Site deployed to gh-pages"
fi

echo "=== Update Complete: $NOW ==="
