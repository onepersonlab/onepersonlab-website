#!/bin/bash
# OnePersonLab Daily Data Completeness Audit
# Check and fix missing data in #agents, #papers, #skills sections
# Usage: ./audit-data-completeness.sh [--agents|--papers|--skills|--all]

set -e

WEBSITE_DIR="/root/onepersonlab-website"
DATA_DIR="$WEBSITE_DIR/data"
LOG_FILE="$WEBSITE_DIR/logs/completeness-$(date +%Y%m%d).log"
TOKEN=$(grep "GITHUB_TOKEN" ~/.openclaw/.env 2>/dev/null | cut -d'=' -f2)
SEMANTIC_KEY=$(grep "SEMANTIC_SCHOLAR_API_KEY" ~/.openclaw/.env 2>/dev/null | cut -d'=' -f2)

NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# Parse arguments
CHECK_AGENTS=false
CHECK_PAPERS=false
CHECK_SKILLS=false

if [ "$1" = "--agents" ]; then CHECK_AGENTS=true; fi
if [ "$1" = "--papers" ]; then CHECK_PAPERS=true; fi
if [ "$1" = "--skills" ]; then CHECK_SKILLS=true; fi
if [ "$1" = "--all" ] || [ -z "$1" ]; then
    CHECK_AGENTS=true
    CHECK_PAPERS=true
    CHECK_SKILLS=true
fi

echo "=== OnePersonLab Data Completeness Audit ===" | tee "$LOG_FILE"
echo "Started: $(date)" | tee -a "$LOG_FILE"
echo "Checking: agents=$CHECK_AGENTS, papers=$CHECK_PAPERS, skills=$CHECK_SKILLS" | tee -a "$LOG_FILE"

# ============================================
# 1. AGENTS: Check Stars/Daily/Forks/Updated values
# ============================================
if [ "$CHECK_AGENTS" = true ]; then
    echo "" | tee -a "$LOG_FILE"
    echo "--- [AGENTS] Checking data completeness ---" | tee -a "$LOG_FILE"
    
    check_agents_file() {
        local file="$1"
        local label="$2"
        
        if [ ! -f "$file" ]; then
            echo "File not found: $file" | tee -a "$LOG_FILE"
            return
        fi
        
        local issues=0
        local fixed=0
        local total=$(jq '.repos | length' "$file")
        
        echo "Checking $label: $total repos" | tee -a "$LOG_FILE"
        
        # Check each repo for missing values
        for i in $(seq 0 $((total - 1))); do
            local repo=$(jq -r ".repos[$i].full_name" "$file")
            local stars=$(jq -r ".repos[$i].stars" "$file")
            local weekly=$(jq -r ".repos[$i].weeklyStars // empty" "$file")
            local forks=$(jq -r ".repos[$i].forks" "$file")
            local updated=$(jq -r ".repos[$i].updated // empty" "$file")
            local url=$(jq -r ".repos[$i].url // empty" "$file")
            
            local missing_fields=""
            
            # Check for null, empty, or 0 values (except weeklyStars which can legitimately be 0)
            if [ -z "$stars" ] || [ "$stars" = "null" ] || [ "$stars" = "0" ]; then
                missing_fields="$missing_fields stars"
            fi
            if [ -z "$weekly" ] || [ "$weekly" = "null" ]; then
                missing_fields="$missing_fields weeklyStars"
            fi
            if [ -z "$forks" ] || [ "$forks" = "null" ]; then
                missing_fields="$missing_fields forks"
            fi
            if [ -z "$updated" ] || [ "$updated" = "null" ]; then
                missing_fields="$missing_fields updated"
            fi
            if [ -z "$url" ] || [ "$url" = "null" ]; then
                missing_fields="$missing_fields url"
            fi
            
            if [ -n "$missing_fields" ]; then
                echo "⚠️  $repo: missing $missing_fields" | tee -a "$LOG_FILE"
                issues=$((issues + 1))
                
                # Fetch fresh data from GitHub API
                local response=$(curl -s -H "Authorization: token $TOKEN" \
                    "https://api.github.com/repos/$repo" 2>/dev/null)
                
                if [ -n "$response" ] && ! echo "$response" | jq -e '.message' > /dev/null 2>&1; then
                    local new_stars=$(echo "$response" | jq -r '.stargazers_count')
                    local new_forks=$(echo "$response" | jq -r '.forks_count')
                    local new_updated=$(echo "$response" | jq -r '.updated_at')
                    
                    # Update the JSON
                    jq --argjson idx "$i" \
                       --argjson stars "$new_stars" \
                       --argjson forks "$new_forks" \
                       --arg updated "$new_updated" \
                       --arg url "https://github.com/$repo" \
                       '.repos[$idx].stars = $stars | .repos[$idx].forks = $forks | .repos[$idx].updated = $updated | .repos[$idx].url = $url' \
                       "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
                    
                    echo "  ✓ Fixed: stars=$new_stars, forks=$new_forks" | tee -a "$LOG_FILE"
                    fixed=$((fixed + 1))
                fi
                
                sleep 0.5
            fi
        done
        
        echo "$label: $issues issues found, $fixed fixed" | tee -a "$LOG_FILE"
    }
    
    check_agents_file "$DATA_DIR/Research-agent-list-update.json" "Research"
    check_agents_file "$DATA_DIR/General-agent-list-update.json" "General"
fi

# ============================================
# 2. PAPERS: Check title/abstract/venue/authors, fill from APIs
# ============================================
if [ "$CHECK_PAPERS" = true ]; then
    echo "" | tee -a "$LOG_FILE"
    echo "--- [PAPERS] Checking data completeness ---" | tee -a "$LOG_FILE"
    
    # API helper functions
    fetch_from_semantic_scholar() {
        local doi="$1"
        local response=$(curl -s "https://api.semanticscholar.org/graph/v1/paper/DOI:$doi?fields=title,abstract,venue,year,authors" \
            -H "x-api-key: $SEMANTIC_KEY" 2>/dev/null)
        echo "$response"
    }
    
    fetch_from_openalex() {
        local doi="$1"
        local response=$(curl -s "https://api.openalex.org/works/doi:$doi" 2>/dev/null)
        echo "$response"
    }
    
    fetch_from_crossref() {
        local doi="$1"
        local response=$(curl -s "https://api.crossref.org/works/$doi" 2>/dev/null)
        echo "$response"
    }
    
    fetch_from_arxiv() {
        local arxiv_id="$1"
        # arxiv_id format: arXiv:XXXX.XXXXX
        local id=$(echo "$arxiv_id" | sed 's/arXiv://')
        local response=$(curl -s "http://export.arxiv.org/api/query?id_list=$id" 2>/dev/null)
        echo "$response"
    }
    
    check_papers_file() {
        local file="$1"
        local label="$2"
        
        if [ ! -f "$file" ]; then
            echo "File not found: $file" | tee -a "$LOG_FILE"
            return
        fi
        
        local issues=0
        local fixed=0
        local total=$(jq '.papers | length' "$file")
        
        echo "Checking $label: $total papers" | tee -a "$LOG_FILE"
        
        for i in $(seq 0 $((total - 1))); do
            local doi=$(jq -r ".papers[$i].doi" "$file")
            local title=$(jq -r ".papers[$i].title // empty" "$file")
            local abstract=$(jq -r ".papers[$i].abstract // empty" "$file")
            local venue=$(jq -r ".papers[$i].venue // empty" "$file")
            local authors=$(jq -r ".papers[$i].authors // empty" "$file")
            local year=$(jq -r ".papers[$i].year // empty" "$file")
            local url=$(jq -r ".papers[$i].url // empty" "$file")
            
            local missing_fields=""
            
            # Check for missing critical fields
            if [ -z "$title" ] || [ "$title" = "null" ] || [ "$title" = "No title" ]; then
                missing_fields="$missing_fields title"
            fi
            if [ -z "$abstract" ] || [ "$abstract" = "null" ]; then
                missing_fields="$missing_fields abstract"
            fi
            if [ -z "$venue" ] || [ "$venue" = "null" ]; then
                missing_fields="$missing_fields venue"
            fi
            if [ -z "$authors" ] || [ "$authors" = "null" ] || [ "$authors" = "[]" ]; then
                missing_fields="$missing_fields authors"
            fi
            if [ -z "$year" ] || [ "$year" = "null" ] || [ "$year" = "0" ]; then
                missing_fields="$missing_fields year"
            fi
            
            if [ -n "$missing_fields" ]; then
                echo "⚠️  DOI $doi: missing $missing_fields" | tee -a "$LOG_FILE"
                issues=$((issues + 1))
                
                local new_title=""
                local new_abstract=""
                local new_venue=""
                local new_authors=""
                local new_year=""
                
                # Try Semantic Scholar first
                local ss_data=$(fetch_from_semantic_scholar "$doi")
                if [ -n "$ss_data" ] && ! echo "$ss_data" | jq -e '.error' > /dev/null 2>&1; then
                    new_title=$(echo "$ss_data" | jq -r '.title // empty')
                    new_abstract=$(echo "$ss_data" | jq -r '.abstract // empty')
                    new_venue=$(echo "$ss_data" | jq -r '.venue // empty')
                    new_year=$(echo "$ss_data" | jq -r '.year // empty')
                    new_authors=$(echo "$ss_data" | jq -r '[.authors[].name] | @json' 2>/dev/null || echo "[]")
                    echo "  → Semantic Scholar: found data" >> "$LOG_FILE"
                fi
                
                # If still missing, try OpenAlex
                if [ -z "$new_title" ] || [ -z "$new_abstract" ] || [ -z "$new_venue" ]; then
                    local oa_data=$(fetch_from_openalex "$doi")
                    if [ -n "$oa_data" ] && ! echo "$oa_data" | jq -e '.error' > /dev/null 2>&1; then
                        [ -z "$new_title" ] && new_title=$(echo "$oa_data" | jq -r '.title // empty')
                        [ -z "$new_abstract" ] && new_abstract=$(echo "$oa_data" | jq -r '.abstract_inverted_index // empty')
                        # Convert inverted index to text if needed
                        if [ "$new_abstract" != "null" ] && [ "$new_abstract" != "empty" ]; then
                            new_abstract=$(echo "$oa_data" | jq -r '.abstract_inverted_index | to_entries | sort_by(.value[0]) | map(.key) | join(" ")' 2>/dev/null || echo "$new_abstract")
                        fi
                        [ -z "$new_venue" ] && new_venue=$(echo "$oa_data" | jq -r '.primary_location.source.display_name // empty')
                        [ -z "$new_year" ] && new_year=$(echo "$oa_data" | jq -r '.publication_year // empty')
                        [ -z "$new_authors" ] && new_authors=$(echo "$oa_data" | jq -r '[.authorships[].author.display_name] | @json' 2>/dev/null || echo "[]")
                        echo "  → OpenAlex: filled remaining gaps" >> "$LOG_FILE"
                    fi
                fi
                
                # If still missing, try Crossref
                if [ -z "$new_title" ] || [ -z "$new_venue" ] || [ -z "$new_year" ] || [ "$new_authors" = "[]" ]; then
                    local cr_data=$(fetch_from_crossref "$doi")
                    if [ -n "$cr_data" ] && ! echo "$cr_data" | jq -e '.message' > /dev/null 2>&1; then
                        [ -z "$new_title" ] && new_title=$(echo "$cr_data" | jq -r '.message.title[0] // empty')
                        [ -z "$new_venue" ] && new_venue=$(echo "$cr_data" | jq -r '.message."container-title"[0] // empty')
                        [ -z "$new_year" ] && new_year=$(echo "$cr_data" | jq -r '.message.published."date-parts"[0][0] // empty')
                        [ "$new_authors" = "[]" ] && new_authors=$(echo "$cr_data" | jq -r '[.message.author[].given + " " + .message.author[].family] | @json' 2>/dev/null || echo "[]")
                        echo "  → Crossref: filled remaining gaps" >> "$LOG_FILE"
                    fi
                fi
                
                # Check if it's an arXiv paper and try arXiv API
                if [[ "$doi" == *"arXiv"* ]] && [ -z "$new_abstract" ]; then
                    local arxiv_data=$(fetch_from_arxiv "$doi")
                    if [ -n "$arxiv_data" ]; then
                        # Parse XML response
                        [ -z "$new_abstract" ] && new_abstract=$(echo "$arxiv_data" | grep -oP '<summary>\K[^<]+' | head -1)
                        [ -z "$new_title" ] && new_title=$(echo "$arxiv_data" | grep -oP '<title>\K[^<]+' | head -1)
                        echo "  → arXiv: filled abstract" >> "$LOG_FILE"
                    fi
                fi
                
                # Update the JSON if we got any data
                if [ -n "$new_title" ] || [ -n "$new_abstract" ] || [ -n "$new_venue" ] || [ -n "$new_year" ] || [ "$new_authors" != "[]" ]; then
                    # Build jq update command
                    local jq_cmd=".papers[$i]"
                    [ -n "$new_title" ] && [ "$new_title" != "null" ] && jq_cmd="$jq_cmd | .papers[$i].title = \"$new_title\""
                    [ -n "$new_abstract" ] && [ "$new_abstract" != "null" ] && jq_cmd="$jq_cmd | .papers[$i].abstract = \"$new_abstract\""
                    [ -n "$new_venue" ] && [ "$new_venue" != "null" ] && jq_cmd="$jq_cmd | .papers[$i].venue = \"$new_venue\""
                    [ -n "$new_year" ] && [ "$new_year" != "null" ] && jq_cmd="$jq_cmd | .papers[$i].year = $new_year"
                    [ "$new_authors" != "[]" ] && [ "$new_authors" != "null" ] && jq_cmd="$jq_cmd | .papers[$i].authors = $new_authors"
                    
                    # Actually update using jq
                    local temp_file="${file}.tmp"
                    if [ -n "$new_title" ] && [ "$new_title" != "null" ]; then
                        jq --argjson idx "$i" --arg title "$new_title" '.papers[$idx].title = $title' "$file" > "$temp_file" && mv "$temp_file" "$file"
                    fi
                    if [ -n "$new_abstract" ] && [ "$new_abstract" != "null" ]; then
                        jq --argjson idx "$i" --arg abstract "$new_abstract" '.papers[$idx].abstract = $abstract' "$file" > "$temp_file" && mv "$temp_file" "$file"
                    fi
                    if [ -n "$new_venue" ] && [ "$new_venue" != "null" ]; then
                        jq --argjson idx "$i" --arg venue "$new_venue" '.papers[$idx].venue = $venue' "$file" > "$temp_file" && mv "$temp_file" "$file"
                    fi
                    if [ -n "$new_year" ] && [ "$new_year" != "null" ] && [ "$new_year" != "0" ]; then
                        jq --argjson idx "$i" --argjson year "$new_year" '.papers[$idx].year = $year' "$file" > "$temp_file" && mv "$temp_file" "$file"
                    fi
                    if [ "$new_authors" != "[]" ] && [ "$new_authors" != "null" ]; then
                        jq --argjson idx "$i" --argjson authors "$new_authors" '.papers[$idx].authors = $authors' "$file" > "$temp_file" && mv "$temp_file" "$file"
                    fi
                    
                    echo "  ✓ Fixed paper data" | tee -a "$LOG_FILE"
                    fixed=$((fixed + 1))
                fi
                
                sleep 1  # Rate limiting
            fi
        done
        
        echo "$label: $issues issues found, $fixed fixed" | tee -a "$LOG_FILE"
    }
    
    check_papers_file "$DATA_DIR/top-6-papers-update.json" "Top-6 Papers"
    check_papers_file "$DATA_DIR/all-papers-update.json" "All Papers"
    check_papers_file "$DATA_DIR/developer-papers-update.json" "Developer Papers"
fi

# ============================================
# 3. SKILLS: Check GitHub stats and ClawHub data
# ============================================
if [ "$CHECK_SKILLS" = true ]; then
    echo "" | tee -a "$LOG_FILE"
    echo "--- [SKILLS] Checking data completeness ---" | tee -a "$LOG_FILE"
    
    # Check GitHub Skills
    check_github_skills() {
        local file="$DATA_DIR/github-skills-update.json"
        
        if [ ! -f "$file" ]; then
            echo "File not found: $file" | tee -a "$LOG_FILE"
            return
        fi
        
        local issues=0
        local fixed=0
        local total=$(jq '.skills | length' "$file")
        
        echo "Checking GitHub Skills: $total skills" | tee -a "$LOG_FILE"
        
        for i in $(seq 0 $((total - 1))); do
            local full_name=$(jq -r ".skills[$i].full_name" "$file")
            local stars=$(jq -r ".skills[$i].stars // empty" "$file")
            local forks=$(jq -r ".skills[$i].forks // empty" "$file")
            local author=$(jq -r ".skills[$i].author // empty" "$file")
            local url=$(jq -r ".skills[$i].url // empty" "$file")
            
            local missing_fields=""
            
            if [ -z "$stars" ] || [ "$stars" = "null" ]; then missing_fields="$missing_fields stars"; fi
            if [ -z "$forks" ] || [ "$forks" = "null" ]; then missing_fields="$missing_fields forks"; fi
            if [ -z "$author" ] || [ "$author" = "null" ] || [ "$author" = "unknown" ] || [ "$author" = "Unknown" ]; then
                missing_fields="$missing_fields author"
            fi
            if [ -z "$url" ] || [ "$url" = "null" ]; then missing_fields="$missing_fields url"; fi
            
            if [ -n "$missing_fields" ]; then
                echo "⚠️  $full_name: missing $missing_fields" | tee -a "$LOG_FILE"
                issues=$((issues + 1))
                
                local response=$(curl -s -H "Authorization: token $TOKEN" \
                    "https://api.github.com/repos/$full_name" 2>/dev/null)
                
                if [ -n "$response" ] && ! echo "$response" | jq -e '.message' > /dev/null 2>&1; then
                    local new_stars=$(echo "$response" | jq -r '.stargazers_count')
                    local new_forks=$(echo "$response" | jq -r '.forks_count')
                    local new_author=$(echo "$response" | jq -r '.owner.login')
                    local new_url="https://github.com/$full_name"
                    
                    # Update JSON
                    local temp="${file}.tmp"
                    jq --argjson idx "$i" --argjson stars "$new_stars" '.skills[$idx].stars = $stars' "$file" > "$temp" && mv "$temp" "$file"
                    jq --argjson idx "$i" --argjson forks "$new_forks" '.skills[$idx].forks = $forks' "$file" > "$temp" && mv "$temp" "$file"
                    jq --argjson idx "$i" --arg author "$new_author" '.skills[$idx].author = $author' "$file" > "$temp" && mv "$temp" "$file"
                    jq --argjson idx "$i" --arg url "$new_url" '.skills[$idx].url = $url' "$file" > "$temp" && mv "$temp" "$file"
                    
                    echo "  ✓ Fixed: stars=$new_stars, forks=$new_forks, author=$new_author" | tee -a "$LOG_FILE"
                    fixed=$((fixed + 1))
                fi
                
                sleep 0.5
            fi
        done
        
        echo "GitHub Skills: $issues issues, $fixed fixed" | tee -a "$LOG_FILE"
    }
    
    # Check ClawHub Skills
    check_clawhub_skills() {
        local file="$DATA_DIR/clawhub-skills-update.json"
        
        if [ ! -f "$file" ]; then
            echo "File not found: $file" | tee -a "$LOG_FILE"
            return
        fi
        
        local issues=0
        local fixed=0
        local total=$(jq '.skills | length' "$file")
        
        echo "Checking ClawHub Skills: $total skills" | tee -a "$LOG_FILE"
        
        for i in $(seq 0 $((total - 1))); do
            local slug=$(jq -r ".skills[$i].slug" "$file")
            local downloads=$(jq -r ".skills[$i].downloads // empty" "$file")
            local stars=$(jq -r ".skills[$i].stars // empty" "$file")
            local author=$(jq -r ".skills[$i].author // empty" "$file")
            local url=$(jq -r ".skills[$i].url // empty" "$file")
            
            local missing_fields=""
            
            if [ -z "$downloads" ] || [ "$downloads" = "null" ]; then missing_fields="$missing_fields downloads"; fi
            if [ -z "$stars" ] || [ "$stars" = "null" ]; then missing_fields="$missing_fields stars"; fi
            if [ -z "$author" ] || [ "$author" = "null" ] || [ "$author" = "unknown" ] || [ "$author" = "Unknown" ]; then
                missing_fields="$missing_fields author"
            fi
            if [ -z "$url" ] || [ "$url" = "null" ]; then missing_fields="$missing_fields url"; fi
            
            if [ -n "$missing_fields" ]; then
                echo "⚠️  $slug: missing $missing_fields" | tee -a "$LOG_FILE"
                issues=$((issues + 1))
                
                # Fetch from ClawHub API (correct structure: .skill.stats and .owner.handle)
                local response=$(curl -s "https://clawhub.ai/api/v1/skills/$slug" 2>/dev/null)
                
                if [ -n "$response" ] && ! echo "$response" | jq -e '.error' > /dev/null 2>&1; then
                    local new_downloads=$(echo "$response" | jq -r '.skill.stats.downloads // 0')
                    local new_stars=$(echo "$response" | jq -r '.skill.stats.stars // 0')
                    local new_author=$(echo "$response" | jq -r '.owner.handle // "unknown"')
                    local new_url="https://clawhub.ai/skills/$slug"
                    
                    # Update JSON
                    local temp="${file}.tmp"
                    jq --argjson idx "$i" --argjson downloads "$new_downloads" '.skills[$idx].downloads = $downloads' "$file" > "$temp" && mv "$temp" "$file"
                    jq --argjson idx "$i" --argjson stars "$new_stars" '.skills[$idx].stars = $stars' "$file" > "$temp" && mv "$temp" "$file"
                    jq --argjson idx "$i" --arg author "$new_author" '.skills[$idx].author = $author' "$file" > "$temp" && mv "$temp" "$file"
                    jq --argjson idx "$i" --arg url "$new_url" '.skills[$idx].url = $url' "$file" > "$temp" && mv "$temp" "$file"
                    
                    if [ "$new_author" = "unknown" ]; then
                        echo "  ⚠️  Author still unknown for $slug" | tee -a "$LOG_FILE"
                    else
                        echo "  ✓ Fixed: downloads=$new_downloads, stars=$new_stars, author=$new_author" | tee -a "$LOG_FILE"
                        fixed=$((fixed + 1))
                    fi
                fi
                
                sleep 0.5
            fi
        done
        
        echo "ClawHub Skills: $issues issues, $fixed fixed" | tee -a "$LOG_FILE"
    }
    
    check_github_skills
    check_clawhub_skills
fi

# ============================================
# 4. Copy updated files to src/data
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "--- Copying to src/data ---" | tee -a "$LOG_FILE"

cp "$DATA_DIR/Research-agent-list-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$DATA_DIR/General-agent-list-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$DATA_DIR/top-6-papers-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$DATA_DIR/all-papers-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$DATA_DIR/developer-papers-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$DATA_DIR/github-skills-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$DATA_DIR/clawhub-skills-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true

echo "✓ Copied all files" | tee -a "$LOG_FILE"

# ============================================
# 5. Rebuild and deploy (optional)
# ============================================
if [ "$2" = "--deploy" ]; then
    echo "" | tee -a "$LOG_FILE"
    echo "--- Rebuilding and deploying ---" | tee -a "$LOG_FILE"
    
    cd "$WEBSITE_DIR"
    npm run build 2>&1 | tail -5 | tee -a "$LOG_FILE"
    
    rm -rf /root/gh-pages-temp
    mkdir -p /root/gh-pages-temp
    cp -r "$WEBSITE_DIR/dist/*" /root/gh-pages-temp/ 2>/dev/null || true
    
    cd /root/gh-pages-temp
    git init --quiet
    git config user.email "onepersonlab@github.com"
    git config user.name "OnePersonLab"
    git add -A
    git commit -m "deploy: completeness audit $(date +%Y%m%d)" --quiet
    git remote add origin https://github.com/onepersonlab/onepersonlab-website.git
    git push origin master:gh-pages --force --quiet 2>/dev/null || true
    
    rm -rf /root/gh-pages-temp
    echo "✓ Deployed to gh-pages" | tee -a "$LOG_FILE"
fi

# ============================================
# Summary
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "=== Audit Complete ===" | tee -a "$LOG_FILE"
echo "Finished: $(date)" | tee -a "$LOG_FILE"

# Push changes
cd "$WEBSITE_DIR"
git add data/*.json src/data/*.json logs/*.log 2>/dev/null || true
git commit -m "audit: data completeness check $(date +%Y%m%d)" --quiet 2>/dev/null || true
git push origin master --quiet 2>/dev/null || true