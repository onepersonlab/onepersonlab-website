#!/bin/bash
# AI Agent Repository Stats Updater - Dual List Version with Auto Deploy
# Updates both Research and General agent lists
# Automatically rebuilds and deploys to gh-pages
# Usage: ./update-repo-stats.sh

set -e

DATA_DIR="/root/onepersonlab-website/data"
TOKEN=$(grep "GITHUB_TOKEN" ~/.openclaw/.env 2>/dev/null | cut -d'=' -f2)
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
TODAY=$(date -u +%Y-%m-%d)

echo "=== AI Agent Repository Stats Updater (Dual List) ==="
echo "Timestamp: $NOW"
echo ""

# Function to update a single list
update_list() {
  LIST_NAME=$1
  BASE_LIST="$DATA_DIR/${LIST_NAME}-agent-list.json"
  UPDATE_LIST="$DATA_DIR/${LIST_NAME}-agent-list-update.json"
  HISTORY_FILE="$DATA_DIR/${LIST_NAME}-stars-history.json"
  
  echo "--- Updating: $LIST_NAME ---"
  
  # Read repos from base list
  REPOS=$(jq -r '.repos[]' "$BASE_LIST")
  TOTAL=$(echo "$REPOS" | wc -l)
  echo "Found $TOTAL repositories"
  
  # Initialize history file if not exists
  if [ ! -f "$HISTORY_FILE" ]; then
    echo '{}' > "$HISTORY_FILE"
  fi
  
  # Build JSON array
  echo '[' > "$UPDATE_LIST.tmp"
  FIRST=true
  COUNT=0
  
  for REPO in $REPOS; do
    COUNT=$((COUNT + 1))
    echo "[$COUNT/$TOTAL] Fetching: $REPO"
    
    # Call GitHub API
    RESPONSE=$(curl -s -H "Authorization: token $TOKEN" -H "Accept: application/vnd.github.v3+json" "https://api.github.com/repos/$REPO" 2>/dev/null)
    
    if [ -z "$RESPONSE" ] || echo "$RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
      echo "  ⚠️ Skipped (API error or not found)"
      continue
    fi
    
    # Parse response using jq to properly escape strings
    NAME=$(echo "$RESPONSE" | jq -r '.name')
    OWNER=$(echo "$RESPONSE" | jq -r '.owner.login')
    DESCRIPTION=$(echo "$RESPONSE" | jq -r '.description // "No description"' | cut -c1-100)
    LANGUAGE=$(echo "$RESPONSE" | jq -r '.language // "Unknown"')
    STARS=$(echo "$RESPONSE" | jq -r '.stargazers_count')
    FORKS=$(echo "$RESPONSE" | jq -r '.forks_count')
    UPDATED=$(echo "$RESPONSE" | jq -r '.updated_at')
    
    # Calculate Daily Stars: compare with nearest historical date
    # History structure: {"repo": {"2026-04-11": {"stars": 70302}, "2026-04-14": {"stars": 71647}}}
    # Find the most recent historical date (before today)
    NEAREST_DATE=$(jq -r '.["'$REPO'"] | keys | map(select(. < "'$TODAY'")) | max // empty' "$HISTORY_FILE" 2>/dev/null)
    
    if [ -z "$NEAREST_DATE" ] || [ "$NEAREST_DATE" = "null" ]; then
      # No historical data, first time recording
      DAILY=0
      NEAREST_STARS=0
      DAYS_DIFF=0
      CHANGE_LABEL="(首次记录)"
    else
      # Calculate days difference
      DAYS_DIFF=$((($(date -d "$TODAY" +%s) - $(date -d "$NEAREST_DATE" +%s)) / 86400))
      
      # Get stars from nearest date
      NEAREST_STARS=$(jq -r '.["'$REPO'"]["'$NEAREST_DATE'"].stars // 0' "$HISTORY_FILE" 2>/dev/null)
      
      # Calculate change
      DAILY=$((STARS - NEAREST_STARS))
      [ $DAILY -lt 0 ] && DAILY=0
      
      # Show days label
      if [ $DAYS_DIFF -eq 1 ]; then
        CHANGE_LABEL="(1天变化)"
      else
        CHANGE_LABEL="($DAYS_DIFF天变化)"
      fi
    fi
    
    # Add to JSON using jq to properly escape special characters
    [ "$FIRST" = false ] && echo ',' >> "$UPDATE_LIST.tmp"
    FIRST=false
    
    # Use jq to safely build the JSON object with proper escaping
    DAILY_INT=$DAILY
    DAYS_INT=$DAYS_DIFF
    echo "$RESPONSE" | jq -c \
      --argjson daily "$DAILY_INT" \
      --argjson days "$DAYS_INT" \
      --arg chglbl "$CHANGE_LABEL" \
      '{full_name: .full_name, name: .name, owner: .owner.login, description: ((.description // "No description") | .[0:100]), language: (.language // "Unknown"), stars: .stargazers_count, forks: .forks_count, weeklyStars: $daily, daysChange: $days, changeLabel: $chglbl, updated: .updated_at, url: ("https://github.com/" + .full_name)}' \
      >> "$UPDATE_LIST.tmp"
    
    # Update history: store by date for daily comparison
    # Structure: {"repo": {"2026-04-14": {"stars": 71647}}}
    jq --arg repo "$REPO" --arg date "$TODAY" --argjson stars "$STARS" \
      '.[$repo][$date] = {"stars": $stars}' \
      "$HISTORY_FILE" > "$HISTORY_FILE.tmp" && mv "$HISTORY_FILE.tmp" "$HISTORY_FILE"
    
    echo "  ✓ Stars: $STARS, Baseline: $NEAREST_STARS ($NEAREST_DATE), Change: +$DAILY $CHANGE_LABEL"
    
    sleep 0.3
  done
  
  echo ']' >> "$UPDATE_LIST.tmp"
  
  # Create final JSON with metadata using jq
  echo "Creating final JSON..."
  jq -s --arg desc "${LIST_NAME} Agent Repositories - Updated Stats" \
       --arg source "GitHub API" \
       --arg generated "$NOW" \
       '.[0] | {description: $desc, source: $source, generated_at: $generated, repo_count: length, repos: .}' \
       "$UPDATE_LIST.tmp" > "$UPDATE_LIST"
  
  rm -f "$UPDATE_LIST.tmp"
  echo "✓ $LIST_NAME complete: $COUNT repos"
  echo ""
}

# Update both lists
update_list "Research"
update_list "General"

# Copy to src/data for frontend
echo ""
echo "--- Copying to src/data ---"
cp "$DATA_DIR/Research-agent-list-update.json" "/root/onepersonlab-website/src/data/Research-agent-list-update.json" 2>/dev/null || true
cp "$DATA_DIR/General-agent-list-update.json" "/root/onepersonlab-website/src/data/General-agent-list-update.json" 2>/dev/null || true
echo "✓ Copied to src/data"

# Rebuild and deploy site
echo ""
echo "--- Rebuilding and deploying site ---"
cd /root/onepersonlab-website

# Build
npm run build 2>&1 | tail -5

# Deploy to gh-pages
rm -rf /tmp/gh-pages-deploy
mkdir -p /tmp/gh-pages-deploy
cp -r dist/* /tmp/gh-pages-deploy/

cd /tmp/gh-pages-deploy
git init
git config user.email "onepersonlab@github.com"
git config user.name "OnePersonLab"
git add -A
git commit -m "auto-deploy: repo stats update $NOW"
git remote add origin https://github.com/onepersonlab/onepersonlab-website.git
git push origin master:gh-pages --force 2>&1 || echo "⚠️ Deploy may have failed"

rm -rf /tmp/gh-pages-deploy

echo "✓ Site deployed to gh-pages"

echo ""
echo "=== All Updates Complete ==="
echo "Generated at: $NOW"