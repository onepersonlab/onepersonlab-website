#!/bin/bash
# Audit all links in OnePersonLab website data files
# Check GitHub repos, papers, and skills links
# Remove invalid entries

set -e

WEBSITE_DIR="/root/onepersonlab-website"
LOG_FILE="$WEBSITE_DIR/logs/audit-$(date +%Y%m%d).log"

echo "=== OnePersonLab Link Audit ===" | tee -a "$LOG_FILE"
echo "Started: $(date)" | tee -a "$LOG_FILE"

# ============================================
# 1. Audit GitHub Repos
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "--- Auditing GitHub Repos ---" | tee -a "$LOG_FILE"

audit_github_repos() {
    local json_file="$1"
    local list_type="$2"
    
    if [ ! -f "$json_file" ]; then
        echo "File not found: $json_file" | tee -a "$LOG_FILE"
        return
    fi
    
    local repos=$(jq -r '.repos[].full_name' "$json_file" 2>/dev/null || jq -r '.skills[].full_name' "$json_file" 2>/dev/null)
    local removed_count=0
    local valid_count=0
    
    for repo in $repos; do
        if [ -z "$repo" ]; then
            continue
        fi
        
        # Check if repo exists via GitHub API
        local status=$(curl -s -o /dev/null -w "%{http_code}" "https://api.github.com/repos/$repo")
        
        if [ "$status" = "404" ]; then
            echo "❌ REMOVED: $repo (404 Not Found)" | tee -a "$LOG_FILE"
            # Remove from JSON
            jq --arg repo "$repo" 'del(.repos[] | select(.full_name == $repo))' "$json_file" > "${json_file}.tmp"
            mv "${json_file}.tmp" "$json_file"
            removed_count=$((removed_count + 1))
        elif [ "$status" = "200" ]; then
            echo "✅ OK: $repo" >> "$LOG_FILE"
            valid_count=$((valid_count + 1))
        elif [ "$status" = "403" ]; then
            echo "⚠️  SKIP: $repo (Rate Limited)" | tee -a "$LOG_FILE"
        else
            echo "⚠️  SKIP: $repo (HTTP $status)" | tee -a "$LOG_FILE"
        fi
    done
    
    echo "$list_type: $valid_count valid, $removed_count removed" | tee -a "$LOG_FILE"
}

# Audit Research repos
audit_github_repos "$WEBSITE_DIR/data/Research-agent-list-update.json" "Research"

# Audit General repos  
audit_github_repos "$WEBSITE_DIR/data/General-agent-list-update.json" "General"

# Audit GitHub Skills
audit_github_repos "$WEBSITE_DIR/data/github-skills-update.json" "GitHub Skills"

# ============================================
# 2. Audit Papers (DOI validation)
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "--- Auditing Papers ---" | tee -a "$LOG_FILE"

audit_papers() {
    local json_file="$1"
    local paper_type="$2"
    
    if [ ! -f "$json_file" ]; then
        echo "File not found: $json_file" | tee -a "$LOG_FILE"
        return
    fi
    
    local papers=$(jq -r '.papers[].doi' "$json_file" 2>/dev/null)
    local removed_count=0
    local valid_count=0
    
    for doi in $papers; do
        if [ -z "$doi" ] || [ "$doi" = "null" ]; then
            continue
        fi
        
        # Check DOI via doi.org API (302 redirect is valid)
        local status=$(curl -s -o /dev/null -w "%{http_code}" "https://doi.org/$doi")
        
        if [ "$status" = "404" ]; then
            echo "❌ REMOVED: $doi (404 Not Found)" | tee -a "$LOG_FILE"
            jq --arg doi "$doi" 'del(.papers[] | select(.doi == $doi))' "$json_file" > "${json_file}.tmp"
            mv "${json_file}.tmp" "$json_file"
            removed_count=$((removed_count + 1))
        elif [ "$status" = "200" ] || [ "$status" = "302" ]; then
            echo "✅ OK: $doi" >> "$LOG_FILE"
            valid_count=$((valid_count + 1))
        else
            echo "⚠️  SKIP: $doi (HTTP $status)" | tee -a "$LOG_FILE"
        fi
    done
    
    echo "$paper_type: $valid_count valid, $removed_count removed" | tee -a "$LOG_FILE"
}

# Audit all papers
audit_papers "$WEBSITE_DIR/data/all-papers-update.json" "All Papers"

# Audit top-6 papers
audit_papers "$WEBSITE_DIR/data/top-6-papers-update.json" "Top-6 Papers"

# Audit developer papers
audit_papers "$WEBSITE_DIR/data/developer-papers-update.json" "Developer Papers"

# ============================================
# 3. Audit ClawHub Skills
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "--- Auditing ClawHub Skills ---" | tee -a "$LOG_FILE"

audit_clawhub_skills() {
    local json_file="$1"
    
    if [ ! -f "$json_file" ]; then
        echo "File not found: $json_file" | tee -a "$LOG_FILE"
        return
    fi
    
    local skills=$(jq -r '.skills[].slug' "$json_file" 2>/dev/null)
    local removed_count=0
    local valid_count=0
    
    for slug in $skills; do
        if [ -z "$slug" ] || [ "$slug" = "null" ]; then
            continue
        fi
        
        # Check ClawHub API (correct endpoint: /api/v1/skills/)
        local status=$(curl -s -o /dev/null -w "%{http_code}" "https://clawhub.ai/api/v1/skills/$slug")
        
        if [ "$status" = "404" ]; then
            echo "❌ REMOVED: $slug (404 Not Found)" | tee -a "$LOG_FILE"
            jq --arg slug "$slug" 'del(.skills[] | select(.slug == $slug))' "$json_file" > "${json_file}.tmp"
            mv "${json_file}.tmp" "$json_file"
            removed_count=$((removed_count + 1))
        elif [ "$status" = "200" ]; then
            echo "✅ OK: $slug" >> "$LOG_FILE"
            valid_count=$((valid_count + 1))
        else
            echo "⚠️  SKIP: $slug (HTTP $status)" | tee -a "$LOG_FILE"
        fi
    done
    
    echo "ClawHub: $valid_count valid, $removed_count removed" | tee -a "$LOG_FILE"
}

audit_clawhub_skills "$WEBSITE_DIR/data/clawhub-skills-update.json"

# ============================================
# 4. Update counts in JSON files
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "--- Updating counts ---" | tee -a "$LOG_FILE"

# Update repo counts
for file in Research-agent-list-update.json General-agent-list-update.json; do
    if [ -f "$WEBSITE_DIR/data/$file" ]; then
        count=$(jq '.repos | length' "$WEBSITE_DIR/data/$file" 2>/dev/null || echo 0)
        jq --argjson count "$count" '.repo_count = $count' "$WEBSITE_DIR/data/$file" > "/tmp/$file"
        mv "/tmp/$file" "$WEBSITE_DIR/data/$file"
        echo "Updated $file: $count repos" | tee -a "$LOG_FILE"
    fi
done

# Update paper counts
for file in all-papers-update.json; do
    if [ -f "$WEBSITE_DIR/data/$file" ]; then
        count=$(jq '.papers | length' "$WEBSITE_DIR/data/$file" 2>/dev/null || echo 0)
        jq --argjson count "$count" '.paper_count = $count' "$WEBSITE_DIR/data/$file" > "/tmp/$file"
        mv "/tmp/$file" "$WEBSITE_DIR/data/$file"
        echo "Updated $file: $count papers" | tee -a "$LOG_FILE"
    fi
done

# Update skill counts
for file in github-skills-update.json clawhub-skills-update.json; do
    if [ -f "$WEBSITE_DIR/data/$file" ]; then
        count=$(jq '.skills | length' "$WEBSITE_DIR/data/$file" 2>/dev/null || echo 0)
        jq --argjson count "$count" '.skill_count = $count' "$WEBSITE_DIR/data/$file" > "/tmp/$file"
        mv "/tmp/$file" "$WEBSITE_DIR/data/$file"
        echo "Updated $file: $count skills" | tee -a "$LOG_FILE"
    fi
done

# ============================================
# 5. Copy updated files to src/data
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "--- Copying to src/data ---" | tee -a "$LOG_FILE"

cp "$WEBSITE_DIR/data/Research-agent-list-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$WEBSITE_DIR/data/General-agent-list-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$WEBSITE_DIR/data/all-papers-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$WEBSITE_DIR/data/top-6-papers-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$WEBSITE_DIR/data/developer-papers-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$WEBSITE_DIR/data/github-skills-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true
cp "$WEBSITE_DIR/data/clawhub-skills-update.json" "$WEBSITE_DIR/src/data/" 2>/dev/null || true

echo "Copied all updated files to src/data" | tee -a "$LOG_FILE"

# ============================================
# 6. Rebuild and deploy
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "--- Rebuilding website ---" | tee -a "$LOG_FILE"

cd "$WEBSITE_DIR"
npm run build 2>&1 | tail -5 | tee -a "$LOG_FILE"

# Deploy to gh-pages
rm -rf /root/gh-pages-temp
mkdir -p /root/gh-pages-temp
cp -r "$WEBSITE_DIR/dist/*" /root/gh-pages-temp/ 2>/dev/null || true

cd /root/gh-pages-temp
git init --quiet
git config user.email "onepersonlab@github.com"
git config user.name "OnePersonLab"
git add -A
git commit -m "deploy: daily audit + update $(date +%Y%m%d)" --quiet
git remote add origin https://github.com/onepersonlab/onepersonlab-website.git
git push origin master:gh-pages --force --quiet 2>/dev/null || true

rm -rf /root/gh-pages-temp

echo "Deployed to gh-pages" | tee -a "$LOG_FILE"

# ============================================
# Summary
# ============================================
echo "" | tee -a "$LOG_FILE"
echo "=== Audit Complete ===" | tee -a "$LOG_FILE"
echo "Finished: $(date)" | tee -a "$LOG_FILE"

# Push changes to master branch
cd "$WEBSITE_DIR"
git add data/*.json src/data/*.json logs/*.log 2>/dev/null || true
git commit -m "audit: daily link verification $(date +%Y%m%d)" --quiet 2>/dev/null || true
git push origin master --quiet 2>/dev/null || true

echo "Changes pushed to GitHub" | tee -a "$LOG_FILE"