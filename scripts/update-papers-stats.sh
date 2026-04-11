#!/bin/bash
# Papers Stats Updater
# Updates citation counts and metadata for all papers
# Usage: ./update-papers-stats.sh

set -e

DATA_DIR="/root/onepersonlab-website/data"
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
LOG_DIR="/root/onepersonlab-website/logs"

echo "=== Papers Stats Updater ==="
echo "Timestamp: $NOW"
echo ""

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Function to fetch paper details from Semantic Scholar
fetch_paper_details() {
  DOI=$1
  DOI_CLEAN=$(echo "$DOI" | sed 's|https://doi.org/||' | sed 's|doi:||')
  
  # Use Semantic Scholar API
  RESULT=$(curl -s "https://api.semanticscholar.org/graph/v1/paper/DOI:$DOI_CLEAN?fields=title,year,authors,venue,citationCount,abstract,externalIds" \
    -H "Accept: application/json" 2>/dev/null || echo "{}")
  
  echo "$RESULT"
}

# Function to update a papers JSON file
update_papers_file() {
  INPUT_FILE=$1
  OUTPUT_FILE=$2
  FILE_TYPE=$3
  
  echo "--- Updating: $FILE_TYPE ---"
  
  if [ ! -f "$INPUT_FILE" ]; then
    echo "⚠️ Input file not found: $INPUT_FILE"
    return
  fi
  
  # Read paper DOIs or titles from input
  PAPERS=$(jq -c '.papers[]' "$INPUT_FILE")
  TOTAL=$(echo "$PAPERS" | wc -l)
  echo "Found $TOTAL papers"
  
  UPDATED_PAPERS="[]"
  COUNT=0
  
  while IFS= read -r PAPER; do
    COUNT=$((COUNT + 1))
    
    DOI=$(echo "$PAPER" | jq -r '.doi // empty')
    TITLE=$(echo "$PAPER" | jq -r '.title // empty')
    ORDER=$(echo "$PAPER" | jq -r '.order // 0')
    
    echo "[$COUNT/$TOTAL] Processing: $TITLE"
    
    if [ -n "$DOI" ] && [ "$DOI" != "null" ]; then
      # Fetch from API
      DETAILS=$(fetch_paper_details "$DOI")
      
      NEW_TITLE=$(echo "$DETAILS" | jq -r '.title // ""')
      NEW_YEAR=$(echo "$DETAILS" | jq -r '.year // 0')
      NEW_VENUE=$(echo "$DETAILS" | jq -r '.venue // ""')
      NEW_CITATIONS=$(echo "$DETAILS" | jq -r '.citationCount // 0')
      NEW_ABSTRACT=$(echo "$DETAILS" | jq -r '.abstract // ""' | head -c 200)
      NEW_AUTHORS=$(echo "$DETAILS" | jq -r '.authors[].name' | jq -R . | jq -s .)
      
      # Use existing title if API returns empty
      if [ -z "$NEW_TITLE" ] || [ "$NEW_TITLE" = "" ]; then
        NEW_TITLE="$TITLE"
      fi
      
      # Build paper object
      PAPER_OBJ=$(jq -n \
        --arg title "$NEW_TITLE" \
        --arg doi "$DOI" \
        --argjson year "$NEW_YEAR" \
        --arg venue "$NEW_VENUE" \
        --argjson citations "$NEW_CITATIONS" \
        --arg abstract "$NEW_ABSTRACT" \
        --argjson authors "$NEW_AUTHORS" \
        --arg url "https://doi.org/$DOI" \
        --argjson order "$ORDER" \
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
      )
      
      echo "  ✓ Citations: $NEW_CITATIONS"
    else
      # Keep existing data, just update timestamp awareness
      PAPER_OBJ="$PAPER"
      echo "  ⚠️ No DOI, keeping existing data"
    fi
    
    UPDATED_PAPERS=$(echo "$UPDATED_PAPERS" | jq --argjson p "$PAPER_OBJ" '. + [$p]')
    
    # Rate limiting - wait 1 second between API calls
    sleep 1
  done <<< "$PAPERS"
  
  # Write output file
  OUTPUT_JSON=$(jq -n \
    --arg desc "Papers - Updated Stats" \
    --arg source "Semantic Scholar API" \
    --arg generated "$NOW" \
    --argjson papers "$UPDATED_PAPERS" \
    --argjson count "$COUNT" \
    '{
      description: $desc,
      source: $source,
      generated_at: $generated,
      paper_count: $count,
      papers: $papers
    }'
  )
  
  echo "$OUTPUT_JSON" > "$OUTPUT_FILE"
  echo "✓ Updated: $OUTPUT_FILE ($COUNT papers)"
}

# Update all paper lists
update_papers_file "$DATA_DIR/top-6-papers.json" "$DATA_DIR/top-6-papers-update.json" "Top 6 Papers"
update_papers_file "$DATA_DIR/all-papers.json" "$DATA_DIR/all-papers-update.json" "All Papers"
update_papers_file "$DATA_DIR/developer-papers.json" "$DATA_DIR/developer-papers-update.json" "Developer Papers"

# Copy to src/data for frontend
echo ""
echo "--- Copying to src/data ---"
cp "$DATA_DIR/top-6-papers-update.json" "/root/onepersonlab-website/src/data/top-6-papers-update.json" 2>/dev/null || true
cp "$DATA_DIR/all-papers-update.json" "/root/onepersonlab-website/src/data/all-papers-update.json" 2>/dev/null || true
cp "$DATA_DIR/developer-papers-update.json" "/root/onepersonlab-website/src/data/developer-papers-update.json" 2>/dev/null || true
echo "✓ Copied to src/data"

# Rebuild site (optional - uncomment if you want auto-deploy)
# echo ""
# echo "--- Rebuilding site ---"
# cd /root/onepersonlab-website && npm run build
# echo "✓ Site rebuilt"

echo ""
echo "=== Papers Update Complete ==="
echo "Finished at: $(date -u +%Y-%m-%dT%H:%M:%SZ)"