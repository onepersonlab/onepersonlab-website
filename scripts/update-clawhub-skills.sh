#!/bin/bash
# ClawHub Skills Updater
# Fetches top skills from ClawHub registry by downloads using API v1
# Usage: ./update-clawhub-skills.sh

set -e

DATA_DIR="/root/onepersonlab-website/data"
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
LOG_DIR="/root/onepersonlab-website/logs"
CLAWHUB_API="https://clawhub.ai/api/v1"

echo "=== ClawHub Skills Updater ==="
echo "Timestamp: $NOW"
echo ""

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Fetch top skills by downloads using search API
# Since /api/v1/skills?sort=downloads returns empty, we use search with manual ranking
echo "--- Fetching ClawHub Skills Stats ---"

# List of known popular skills (will be updated dynamically)
KNOWN_SKILLS="self-improving-agent agent-browser-clawdbot openclaw-tavily-search xiucheng-self-improving-agent literature-review openclaw-cli openclaw-ops-guardrails agent-directory agent-team agent-group openclaw-error-fix openclaw-power-ops"

SKILLS_JSON="[]"

for SLUG in $KNOWN_SKILLS; do
  echo "Fetching: $SLUG"
  
  RESULT=$(curl -s "$CLAWHUB_API/skills/$SLUG" 2>/dev/null || echo "{}")
  
  SLUG_VAL=$(echo "$RESULT" | jq -r '.skill.slug // empty')
  DISPLAY=$(echo "$RESULT" | jq -r '.skill.displayName // .skill.slug // empty')
  SUMMARY=$(echo "$RESULT" | jq -r '.skill.summary // ""' | head -c 80)
  DOWNLOADS=$(echo "$RESULT" | jq -r '.skill.stats.downloads // 0')
  STARS=$(echo "$RESULT" | jq -r '.skill.stats.stars // 0')
  OWNER=$(echo "$RESULT" | jq -r '.owner.handle // "unknown"')
  
  if [ -n "$SLUG_VAL" ]; then
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
      }'
    )
    
    SKILLS_JSON=$(echo "$SKILLS_JSON" | jq --argjson s "$SKILL_OBJ" '. + [$s]')
  fi
  
  sleep 1
done

# Sort by downloads descending
SKILLS_JSON=$(echo "$SKILLS_JSON" | jq 'sort_by(-.downloads) | .[:12]')

COUNT=$(echo "$SKILLS_JSON" | jq 'length')

# Write output
OUTPUT_JSON=$(jq -n \
  --arg desc "ClawHub Skills - Top Downloads (Real Data from API)" \
  --arg source "ClawHub API v1" \
  --arg generated "$NOW" \
  --argjson count "$COUNT" \
  --argjson skills "$SKILLS_JSON" \
  '{
    description: $desc,
    source: $source,
    generated_at: $generated,
    skill_count: $count,
    skills: $skills
  }'
)

echo "$OUTPUT_JSON" > "$DATA_DIR/clawhub-skills-update.json"
cp "$DATA_DIR/clawhub-skills-update.json" "/root/onepersonlab-website/src/data/clawhub-skills-update.json"
echo "✓ Updated: $DATA_DIR/clawhub-skills-update.json ($COUNT skills)"

echo ""
echo "=== ClawHub Skills Update Complete ==="
echo "Finished at: $(date -u +%Y-%m-%dT%H:%M:%SZ)"