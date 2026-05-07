#!/bin/bash
# Data Completeness Audit
# Ensure ~/.local/bin is in PATH (for jq etc.)
export PATH="$HOME/.local/bin:$PATH"

# Checks and fixes missing fields in all data files
# Usage: ./scripts/audit-data-completeness.sh [--agents|--papers|--skills|--all] [--deploy]

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$REPO_ROOT/src/data"
LOG_DIR="$REPO_ROOT/logs"
mkdir -p "$LOG_DIR"

LOG_FILE="$LOG_DIR/completeness-$(date +%Y%m%d-%H%M%S).log"

# Secrets
TOKEN="${GITHUB_TOKEN:-}"
[ -z "$TOKEN" ] && TOKEN=$(grep "GITHUB_TOKEN" "$HOME/.openclaw/.env" 2>/dev/null | cut -d'=' -f2 || true)
SEMANTIC_KEY="${SEMANTIC_SCHOLAR_API_KEY:-}"
[ -z "$SEMANTIC_KEY" ] && SEMANTIC_KEY=$(grep "SEMANTIC_SCHOLAR_API_KEY" "$HOME/.openclaw/.env" 2>/dev/null | cut -d'=' -f2 || true)

NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
CHECK_AGENTS=true
CHECK_PAPERS=true
CHECK_SKILLS=true
DEPLOY=false

for arg in "$@"; do
  case "$arg" in
    --agents) CHECK_AGENTS=true; CHECK_PAPERS=false; CHECK_SKILLS=false ;;
    --papers) CHECK_AGENTS=false; CHECK_PAPERS=true; CHECK_SKILLS=false ;;
    --skills) CHECK_AGENTS=false; CHECK_PAPERS=false; CHECK_SKILLS=true ;;
    --all)    CHECK_AGENTS=true; CHECK_PAPERS=true; CHECK_SKILLS=true ;;
    --deploy) DEPLOY=true ;;
  esac
done

log() { echo "$@" | tee -a "$LOG_FILE"; }

log "=== Data Completeness Audit ==="
log "Started: $(date)"
log ""

# ═══════════════════════════════════════
# AGENTS: Check stars/forks/updated
# ═══════════════════════════════════════
if [ "$CHECK_AGENTS" = true ]; then
  log "--- [AGENTS] ---"

  check_agents() {
    file="$1"
    label="$2"
    [ ! -f "$file" ] && { log "  ✗ File not found: $file"; return; }

    total=0; issues=0; fixed=0
    total=$(jq '.repos | length' "$file" 2>/dev/null)
    log "  $label: $total repos"

    for i in $(seq 0 $((total - 1))); do
      repo=$(jq -r ".repos[$i].full_name" "$file")
      stars=$(jq -r ".repos[$i].stars" "$file")
      weekly=$(jq -r ".repos[$i].weeklyStars // empty" "$file")
      forks=$(jq -r ".repos[$i].forks" "$file")
      updated=$(jq -r ".repos[$i].updated // empty" "$file")
      url=$(jq -r ".repos[$i].url // empty" "$file")

      missing=""
      [ -z "$stars" ] || [ "$stars" = "null" ] || [ "$stars" = "0" ] && missing="$missing stars"
      [ -z "$weekly" ] || [ "$weekly" = "null" ] && missing="$missing weeklyStars"
      [ -z "$forks" ] || [ "$forks" = "null" ] && missing="$missing forks"
      [ -z "$updated" ] || [ "$updated" = "null" ] && missing="$missing updated"
      [ -z "$url" ] || [ "$url" = "null" ] && missing="$missing url"

      if [ -n "$missing" ]; then
        log "  ⚠️  $repo: missing$missing"
        issues=$((issues + 1))

        if [ -n "$TOKEN" ]; then
          response=$(curl -s --connect-timeout 10 --max-time 30 \
            -H "Authorization: token $TOKEN" \
            "https://api.github.com/repos/$repo" 2>/dev/null || echo "")

          if [ -n "$response" ] && ! echo "$response" | jq -e '.message' > /dev/null 2>&1; then
            ns=$(echo "$response" | jq -r '.stargazers_count')
            nf=$(echo "$response" | jq -r '.forks_count')
            nu=$(echo "$response" | jq -r '.updated_at')

            jq --argjson idx "$i" --argjson s "$ns" '.repos[$idx].stars = $s' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
            jq --argjson idx "$i" --argjson f "$nf" '.repos[$idx].forks = $f' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
            jq --argjson idx "$i" --arg u "$nu" --arg u2 "https://github.com/$repo" \
              '.repos[$idx].updated = $u | .repos[$idx].url = $u2' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"

            log "    ✓ Fixed: stars=$ns, forks=$nf"
            fixed=$((fixed + 1))
          fi
        fi
        sleep 0.5
      fi
    done
    log "  $label: $issues issues, $fixed fixed"
  }

  check_agents "$DATA_DIR/Research-agent-list-update.json" "Research"
  check_agents "$DATA_DIR/General-agent-list-update.json"  "General"
fi

# ═══════════════════════════════════════
# PAPERS: Check title/abstract/venue/authors
# ═══════════════════════════════════════
if [ "$CHECK_PAPERS" = true ]; then
  log ""
  log "--- [PAPERS] ---"

  check_papers() {
    file="$1"
    label="$2"
    [ ! -f "$file" ] && { log "  ✗ File not found: $file"; return; }

    total=0; issues=0; fixed=0
    total=$(jq '.papers | length' "$file" 2>/dev/null)
    log "  $label: $total papers"

    for i in $(seq 0 $((total - 1))); do
      doi=$(jq -r ".papers[$i].doi // empty" "$file")
      title=$(jq -r ".papers[$i].title // empty" "$file")
      abstract=$(jq -r ".papers[$i].abstract // empty" "$file")
      venue=$(jq -r ".papers[$i].venue // empty" "$file")
      authors=$(jq -r ".papers[$i].authors // empty" "$file")
      year=$(jq -r ".papers[$i].year // empty" "$file")

      missing=""
      [ -z "$title" ] || [ "$title" = "null" ] || [ "$title" = "No title" ] && missing="$missing title"
      [ -z "$abstract" ] || [ "$abstract" = "null" ] && missing="$missing abstract"
      [ -z "$venue" ] || [ "$venue" = "null" ] && missing="$missing venue"
      [ -z "$authors" ] || [ "$authors" = "null" ] || [ "$authors" = "[]" ] && missing="$missing authors"
      [ -z "$year" ] || [ "$year" = "null" ] || [ "$year" = "0" ] && missing="$missing year"

      if [ -n "$missing" ]; then
        log "  ⚠️  DOI $doi: missing$missing"
        issues=$((issues + 1))

        if [ -n "$doi" ] && [ "$doi" != "null" ]; then
          dc=$(echo "$doi" | sed 's|https://doi.org/||' | sed 's|doi:||')

          # Try Semantic Scholar
          ss_hd=""
          [ -n "$SEMANTIC_KEY" ] && ss_hd="-H x-api-key:$SEMANTIC_KEY"
          ss=$(curl -s --connect-timeout 10 --max-time 30 $ss_hd \
            "https://api.semanticscholar.org/graph/v1/paper/DOI:$dc?fields=title,abstract,venue,year,authors" 2>/dev/null || echo "{}")

          if [ -n "$ss" ] && ! echo "$ss" | jq -e '.error' > /dev/null 2>&1; then
            nt=$(echo "$ss" | jq -r '.title // empty')
            na=$(echo "$ss" | jq -r '.abstract // empty' | head -c 200)
            nv=$(echo "$ss" | jq -r '.venue // empty')
            ny=$(echo "$ss" | jq -r '.year // 0')
            nauth=$(echo "$ss" | jq -r '[.authors[].name] | @json' 2>/dev/null || echo "[]")

            [ -n "$nt" ] && [ "$nt" != "null" ] && jq --argjson idx "$i" --arg v "$nt" '.papers[$idx].title = $v' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
            [ -n "$na" ] && [ "$na" != "null" ] && jq --argjson idx "$i" --arg v "$na" '.papers[$idx].abstract = $v' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
            [ -n "$nv" ] && [ "$nv" != "null" ] && jq --argjson idx "$i" --arg v "$nv" '.papers[$idx].venue = $v' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
            [ "$ny" != "0" ] && [ "$ny" != "null" ] && jq --argjson idx "$i" --argjson v "$ny" '.papers[$idx].year = $v' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
            [ "$nauth" != "[]" ] && [ "$nauth" != "null" ] && jq --argjson idx "$i" --argjson v "$nauth" '.papers[$idx].authors = $v' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"

            log "    ✓ Fixed via Semantic Scholar"
            fixed=$((fixed + 1))
          fi
        fi
        sleep 1
      fi
    done
    log "  $label: $issues issues, $fixed fixed"
  }

  check_papers "$DATA_DIR/top-6-papers-update.json"    "Top-6"
  check_papers "$DATA_DIR/all-papers-update.json"       "All"
  check_papers "$DATA_DIR/developer-papers-update.json" "Developer"
fi

# ═══════════════════════════════════════
# SKILLS: Check GitHub and ClawHub skills
# ═══════════════════════════════════════
if [ "$CHECK_SKILLS" = true ]; then
  log ""
  log "--- [SKILLS] ---"

  # GitHub Skills
  gs_file="$DATA_DIR/github-skills-update.json"
  if [ -f "$gs_file" ]; then
    gs_total=0; issues=0; fixed=0
    gs_total=$(jq '.skills | length' "$gs_file" 2>/dev/null)
    log "  GitHub Skills: $gs_total"

    for i in $(seq 0 $((gs_total - 1))); do
      fn=$(jq -r ".skills[$i].full_name" "$gs_file")
      stars=$(jq -r ".skills[$i].stars // empty" "$gs_file")
      forks=$(jq -r ".skills[$i].forks // empty" "$gs_file")
      author=$(jq -r ".skills[$i].author // empty" "$gs_file")

      missing=""
      [ -z "$stars" ] || [ "$stars" = "null" ] && missing="$missing stars"
      [ -z "$forks" ] || [ "$forks" = "null" ] && missing="$missing forks"

      if [ -n "$missing" ]; then
        log "  ⚠️  $fn: missing$missing"
        issues=$((issues + 1))

        if [ -n "$TOKEN" ]; then
          resp=$(curl -s --connect-timeout 10 --max-time 30 \
            -H "Authorization: token $TOKEN" \
            "https://api.github.com/repos/$fn" 2>/dev/null || echo "")
          if [ -n "$resp" ] && ! echo "$resp" | jq -e '.message' > /dev/null 2>&1; then
            ns=$(echo "$resp" | jq -r '.stargazers_count')
            nf=$(echo "$resp" | jq -r '.forks_count')
            jq --argjson idx "$i" --argjson s "$ns" '.skills[$idx].stars = $s' "$gs_file" > "${gs_file}.tmp" && mv "${gs_file}.tmp" "$gs_file"
            jq --argjson idx "$i" --argjson f "$nf" '.skills[$idx].forks = $f' "$gs_file" > "${gs_file}.tmp" && mv "${gs_file}.tmp" "$gs_file"
            log "    ✓ Fixed: stars=$ns, forks=$nf"
            fixed=$((fixed + 1))
          fi
        fi
        sleep 0.5
      fi
    done
    log "  GitHub Skills: $issues issues, $fixed fixed"
  fi

  # ClawHub Skills
  cs_file="$DATA_DIR/clawhub-skills-update.json"
  if [ -f "$cs_file" ]; then
    cs_total=0; issues=0; fixed=0
    cs_total=$(jq '.skills | length' "$cs_file" 2>/dev/null)
    log "  ClawHub Skills: $cs_total"

    for i in $(seq 0 $((cs_total - 1))); do
      slug=$(jq -r ".skills[$i].slug" "$cs_file")
      downloads=$(jq -r ".skills[$i].downloads // empty" "$cs_file")
      stars=$(jq -r ".skills[$i].stars // empty" "$cs_file")

      missing=""
      [ -z "$downloads" ] || [ "$downloads" = "null" ] && missing="$missing downloads"
      [ -z "$stars" ] || [ "$stars" = "null" ] && missing="$missing stars"

      if [ -n "$missing" ]; then
        log "  ⚠️  $slug: missing$missing"
        issues=$((issues + 1))

        resp=$(curl -s --connect-timeout 10 --max-time 30 \
          "https://clawhub.ai/api/v1/skills/$slug" 2>/dev/null || echo "{}")
        if [ -n "$resp" ] && ! echo "$resp" | jq -e '.error' > /dev/null 2>&1; then
          nd=$(echo "$resp" | jq -r '.skill.stats.downloads // 0')
          ns=$(echo "$resp" | jq -r '.skill.stats.stars // 0')
          jq --argjson idx "$i" --argjson d "$nd" '.skills[$idx].downloads = $d' "$cs_file" > "${cs_file}.tmp" && mv "${cs_file}.tmp" "$cs_file"
          jq --argjson idx "$i" --argjson s "$ns" '.skills[$idx].stars = $s' "$cs_file" > "${cs_file}.tmp" && mv "${cs_file}.tmp" "$cs_file"
          log "    ✓ Fixed: downloads=$nd, stars=$ns"
          fixed=$((fixed + 1))
        fi
        sleep 0.5
      fi
    done
    log "  ClawHub Skills: $issues issues, $fixed fixed"
  fi
fi

# ═══════════════════════════════════════
# Deploy if requested
# ═══════════════════════════════════════
if [ "$DEPLOY" = true ]; then
  log ""
  log "--- Deploying ---"
  cd "$REPO_ROOT"
  npm run build 2>&1 | tail -5 | tee -a "$LOG_FILE"

  rm -rf /tmp/gh-pages-deploy
  mkdir -p /tmp/gh-pages-deploy
  cp -r dist/* /tmp/gh-pages-deploy/
  cd /tmp/gh-pages-deploy
  git init -q
  git config user.email "onepersonlab@github.com"
  git config user.name "OnePersonLab"
  git add -A
  git commit -m "deploy: audit $(date +%Y%m%d)" -q
  git remote add origin "https://github.com/onepersonlab/onepersonlab-website.git"
  git push origin master:gh-pages --force -q 2>&1 || log "⚠️ Deploy may have failed"
  rm -rf /tmp/gh-pages-deploy
  log "✓ Deployed"
fi

log ""
log "=== Audit Complete: $(date) ==="
