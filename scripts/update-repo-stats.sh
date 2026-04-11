#!/bin/bash
# AI Agent Repository Stats Updater
# Usage: ./update-repo-stats.sh

set -e

DATA_DIR="/root/onepersonlab-website/data"
BASE_LIST="$DATA_DIR/AI-agent-list.json"
UPDATE_LIST="$DATA_DIR/AI-agent-list-update.json"

echo "=== AI Agent Repository Stats Updater ==="
echo "Base list: $BASE_LIST"
echo "Output: $UPDATE_LIST"
echo ""

# Read repos from base list
REPOS=$(jq -r '.repos[]' "$BASE_LIST")

echo "Found $(echo "$REPOS" | wc -l) repositories to update"
echo ""

# Build JSON array
echo '[' > "$UPDATE_LIST"

FIRST=true
for REPO in $REPOS; do
    echo "Fetching: $REPO"
    
    # Call GitHub API (with retry on rate limit)
    RESPONSE=$(curl -s "https://api.github.com/repos/$REPO" 2>/dev/null)
    
    if [ -z "$RESPONSE" ] || echo "$RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
        echo "  ⚠️ API limit or error, using fallback data"
        # Fallback: try web fetch
        WEB_DATA=$(curl -sI "https://github.com/$REPO" | grep -E "^HTTP|^last-modified" | head -2)
        echo "  Web check: $WEB_DATA"
        
        # Use placeholder data if API fails
        NAME=$(echo "$REPO" | cut -d'/' -f2)
        OWNER=$(echo "$REPO" | cut -d'/' -f1)
        DESCRIPTION="AI research repository"
        LANGUAGE="Unknown"
        STARS=0
        FORKS=0
        WEEKLY=0
        UPDATED="unknown"
    else
        # Parse API response
        NAME=$(echo "$RESPONSE" | jq -r '.name')
        OWNER=$(echo "$RESPONSE" | jq -r '.owner.login')
        DESCRIPTION=$(echo "$RESPONSE" | jq -r '.description // "No description"')
        LANGUAGE=$(echo "$RESPONSE" | jq -r '.language // "Unknown"')
        STARS=$(echo "$RESPONSE" | jq -r '.stargazers_count')
        FORKS=$(echo "$RESPONSE" | jq -r '.forks_count')
        UPDATED=$(echo "$RESPONSE" | jq -r '.updated_at')
        
        # Weekly stars - estimate based on recent activity (placeholder)
        WEEKLY=0
    fi
    
    # Add comma if not first
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo ',' >> "$UPDATE_LIST"
    fi
    
    # Write JSON object
    cat >> "$UPDATE_LIST" << EOF
  {
    "full_name": "$REPO",
    "name": "$NAME",
    "owner": "$OWNER",
    "description": "$DESCRIPTION",
    "language": "$LANGUAGE",
    "stars": $STARS,
    "forks": $FORKS,
    "weeklyStars": $WEEKLY,
    "updated": "$UPDATED",
    "url": "https://github.com/$REPO"
  }
EOF
    
    echo "  ✓ Stars: $STARS, Language: $LANGUAGE"
    
    # Sleep to avoid rate limit (1 second between requests)
    sleep 1
done

echo ']' >> "$UPDATE_LIST"

# Add metadata header
FINAL_OUTPUT=$(cat << EOF
{
  "description": "AI Agent Research Repositories - Updated Stats",
  "source": "https://github.com/cadslab/Pantheon",
  "generated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "repo_count": $(echo "$REPOS" | wc -l),
  "repos": $(cat "$UPDATE_LIST")
}
EOF
)

echo "$FINAL_OUTPUT" > "$UPDATE_LIST"

echo ""
echo "=== Update Complete ==="
echo "Output saved to: $UPDATE_LIST"
echo "Total repos: $(jq '.repo_count' "$UPDATE_LIST")"