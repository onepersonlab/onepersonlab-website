#!/bin/bash
# ClawHub Skills Updater
# Fetches top skills from ClawHub registry by downloads
# Usage: ./update-clawhub-skills.sh

set -e

DATA_DIR="/root/onepersonlab-website/data"
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
LOG_DIR="/root/onepersonlab-website/logs"

echo "=== ClawHub Skills Updater ==="
echo "Timestamp: $NOW"
echo ""

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# ClawHub uses Convex backend - we need to use their public API
# For now, we'll use a placeholder approach since ClawHub API requires authentication
# The skills data is maintained manually through the ClawHub web interface

echo "Note: ClawHub skills are updated through the registry interface."
echo "Current data file: $DATA_DIR/clawhub-skills-update.json"
echo ""

# Future implementation: When ClawHub exposes a public API endpoint for skill listings,
# we can fetch data via:
# curl -s "https://clawhub.ai/api/skills?sort=downloads&limit=12" | jq '.' > "$DATA_DIR/clawhub-skills-update.json"

# For now, just verify the file exists and copy to src
if [ -f "$DATA_DIR/clawhub-skills-update.json" ]; then
  cp "$DATA_DIR/clawhub-skills-update.json" "/root/onepersonlab-website/src/data/clawhub-skills-update.json"
  echo "✓ ClawHub skills data copied to src/data"
else
  echo "⚠️ ClawHub skills file not found"
fi

# Also update GitHub skills
TOKEN=$(grep "GITHUB_TOKEN" ~/.openclaw/.env 2>/dev/null | cut -d'=' -f2)

echo ""
echo "--- Updating GitHub Skills ---"

# Read list of skill repos
if [ -f "$DATA_DIR/github-skills.json" ]; then
  SKILLS=$(jq -r '.skills[].full_name' "$DATA_DIR/github-skills.json")
  COUNT=$(echo "$SKILLS" | wc -l)
  echo "Found $COUNT skill repositories"
  
  UPDATED_SKILLS="[]"
  
  for SKILL in $SKILLS; do
    echo "Fetching: $SKILL"
    
    RESULT=$(curl -s "https://api.github.com/repos/$SKILL" \
      -H "Authorization: token $TOKEN" \
      -H "Accept: application/vnd.github.v3+json" 2>/dev/null || echo "{}")
    
    NAME=$(echo "$RESULT" | jq -r '.name // ""')
    OWNER=$(echo "$RESULT" | jq -r '.owner.login // ""')
    DESC=$(echo "$RESULT" | jq -r '.description // "No description"' | head -c 80)
    LANG=$(echo "$RESULT" | jq -r '.language // null')
    STARS=$(echo "$RESULT" | jq -r '.stargazers_count // 0')
    FORKS=$(echo "$RESULT" | jq -r '.forks_count // 0')
    
    echo "  ✓ Stars: $STARS"
    
    # Build skill object
    SKILL_OBJ=$(jq -n \
      --arg fn "$SKILL" \
      --arg n "$NAME" \
      --arg o "$OWNER" \
      --arg d "$DESC" \
      --argjson l "$LANG" \
      --argjson s "$STARS" \
      --argjson f "$FORKS" \
      --arg u "https://github.com/$SKILL" \
      '{
        full_name: $fn,
        name: $n,
        owner: $o,
        description: $d,
        language: $l,
        stars: $s,
        forks: $f,
        weeklyStars: 0,
        updated: "recently",
        url: $u,
        category: "Skills"
      }'
    )
    
    UPDATED_SKILLS=$(echo "$UPDATED_SKILLS" | jq --argjson s "$SKILL_OBJ" '. + [$s]')
    
    sleep 1
  done
  
  # Write output file
  OUTPUT_JSON=$(jq -n \
    --arg desc "GitHub Skills - Updated Stats" \
    --arg source "GitHub API" \
    --arg generated "$NOW" \
    --argjson count "$COUNT" \
    --argjson skills "$UPDATED_SKILLS" \
    '{
      description: $desc,
      source: $source,
      generated_at: $generated,
      skill_count: $count,
      skills: $skills
    }'
  )
  
  echo "$OUTPUT_JSON" > "$DATA_DIR/github-skills-update.json"
  cp "$DATA_DIR/github-skills-update.json" "/root/onepersonlab-website/src/data/github-skills-update.json"
  echo "✓ Updated: $DATA_DIR/github-skills-update.json"
fi

echo ""
echo "=== Skills Update Complete ==="
echo "Finished at: $(date -u +%Y-%m-%dT%H:%M:%SZ)"