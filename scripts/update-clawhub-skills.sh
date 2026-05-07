#!/bin/bash
# ClawHub Skills Updater
# Ensure ~/.local/bin is in PATH (for jq etc.)
export PATH="$HOME/.local/bin:$PATH"

# Fetches top skills from ClawHub registry
# Usage: ./scripts/update-clawhub-skills.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$REPO_ROOT/src/data"
CLAWHUB_API="https://clawhub.ai/api/v1"
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "=== ClawHub Skills Updater ==="
echo "Timestamp: $NOW"
echo ""

# Popular skills list (update periodically)
KNOWN_SKILLS="self-improving-agent agent-browser-clawdbot openclaw-tavily-search xiucheng-self-improving-agent literature-review openclaw-cli openclaw-ops-guardrails agent-directory agent-team agent-group openclaw-error-fix openclaw-power-ops"

SKILLS_JSON="[]"
COUNT=0
ERRORS=0

for SLUG in $KNOWN_SKILLS; do
  COUNT=$((COUNT + 1))
  echo "[$COUNT] $SLUG"

  RESPONSE=$(curl -s --connect-timeout 10 --max-time 30 "$CLAWHUB_API/skills/$SLUG" 2>/dev/null || echo "{}")

  SLUG_VAL=$(echo "$RESPONSE" | jq -r '.skill.slug // empty')
  if [ -z "$SLUG_VAL" ]; then
    echo "  ⚠️  Not found, skipping"
    ERRORS=$((ERRORS + 1))
    continue
  fi

  DISPLAY=$(echo "$RESPONSE" | jq -r '.skill.displayName // .skill.slug // empty')
  SUMMARY=$(echo "$RESPONSE" | jq -r '.skill.summary // ""' | head -c 80)
  DOWNLOADS=$(echo "$RESPONSE" | jq -r '.skill.stats.downloads // 0')
  STARS=$(echo "$RESPONSE" | jq -r '.skill.stats.stars // 0')
  OWNER=$(echo "$RESPONSE" | jq -r '.owner.handle // "unknown"')

  echo "  ✓ Downloads: $DOWNLOADS, Stars: $STARS"

  SKILL_OBJ=$(jq -n \
    --arg slug "$SLUG_VAL" \
    --arg display "$DISPLAY" \
    --arg summary "$SUMMARY" \
    --arg category "General" \
    --argjson downloads "$DOWNLOADS" \
    --argjson stars "$STARS" \
    --arg author "$OWNER" \
    --arg url "https://clawhub.ai/$OWNER/$SLUG_VAL" \
    '{
      slug: $slug,
      displayName: $display,
      description: $summary,
      category: $category,
      downloads: $downloads,
      stars: $stars,
      author: $author,
      url: $url
    }')

  SKILLS_JSON=$(echo "$SKILLS_JSON" | jq --argjson s "$SKILL_OBJ" '. + [$s]')
  sleep 1
done

# Sort by downloads descending, top 12
SKILLS_JSON=$(echo "$SKILLS_JSON" | jq 'sort_by(-.downloads) | .[:12]')
FINAL_COUNT=$(echo "$SKILLS_JSON" | jq 'length')

jq -n \
  --arg desc "ClawHub Skills - Top Downloads" \
  --arg source "ClawHub API v1" \
  --arg generated "$NOW" \
  --argjson count "$FINAL_COUNT" \
  --argjson skills "$SKILLS_JSON" \
  '{
    description: $desc,
    source: $source,
    generated_at: $generated,
    skill_count: $count,
    skills: $skills
  }' > "$DATA_DIR/clawhub-skills-update.json"

echo "✓ Updated: $DATA_DIR/clawhub-skills-update.json ($FINAL_COUNT skills)"
echo ""
echo "=== ClawHub Skills Update Complete: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="
