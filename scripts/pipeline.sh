#!/bin/bash
# Data Pipeline Orchestrator
# Ensure ~/.local/bin is in PATH (for jq etc.)
export PATH="$HOME/.local/bin:$PATH"

# Runs all data updates in order with proper error handling
# Usage: ./scripts/pipeline.sh [--deploy] [--skip-agents] [--skip-papers] [--skip-skills] [--skip-audit]

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPTS_DIR="$REPO_ROOT/scripts"
LOG_DIR="$REPO_ROOT/logs"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date -u +%Y%m%d-%H%M%S)
LOG_FILE="$LOG_DIR/pipeline-${TIMESTAMP}.log"
DEPLOY=false
SKIP_AGENTS=false
SKIP_PAPERS=false
SKIP_SKILLS=false
SKIP_AUDIT=false

for arg in "$@"; do
  case "$arg" in
    --deploy) DEPLOY=true ;;
    --skip-agents) SKIP_AGENTS=true ;;
    --skip-papers) SKIP_PAPERS=true ;;
    --skip-skills) SKIP_SKILLS=true ;;
    --skip-audit) SKIP_AUDIT=true ;;
  esac
done

log() { echo "$@" | tee -a "$LOG_FILE"; }

log "╔══════════════════════════════════════╗"
log "║   OnePersonLab Data Pipeline        ║"
log "╠══════════════════════════════════════╣"
log "║ Started: $(date)                   "
log "║ Deploy:  $DEPLOY"
log "╚══════════════════════════════════════╝"
log ""

EXIT_CODE=0
FAILED_STEPS=""

run_step() {
  local name="$1"
  local script="$2"
  local skip="$3"

  if [ "$skip" = "true" ]; then
    log "⏭️  SKIP: $name"
    return 0
  fi

  log "▶️  RUN:  $name"
  log "──────────────────────────────────────"

  if [ "$DEPLOY" = "true" ]; then
    if bash "$script" --deploy >> "$LOG_FILE" 2>&1; then
      log "✅ PASS: $name"
    else
      log "❌ FAIL: $name"
      FAILED_STEPS="$FAILED_STEPS $name"
      EXIT_CODE=1
    fi
  else
    if bash "$script" >> "$LOG_FILE" 2>&1; then
      log "✅ PASS: $name"
    else
      log "❌ FAIL: $name"
      FAILED_STEPS="$FAILED_STEPS $name"
      EXIT_CODE=1
    fi
  fi
  log ""
}

# Step 1: Repo stats (fast, GitHub API)
run_step "Repo Stats"        "$SCRIPTS_DIR/update-repo-stats.sh"        "$SKIP_AGENTS"

# Step 2: Papers stats (slow, Semantic Scholar rate limit)
run_step "Papers Stats"      "$SCRIPTS_DIR/update-papers-stats.sh"      "$SKIP_PAPERS"

# Step 3: ClawHub skills
run_step "ClawHub Skills"    "$SCRIPTS_DIR/update-clawhub-skills.sh"    "$SKIP_SKILLS"

# Step 4: Data quality audit
run_step "Data Audit"        "$SCRIPTS_DIR/audit-data-completeness.sh"  "$SKIP_AUDIT"

# Summary
log "╔══════════════════════════════════════╗"
log "║   Pipeline Summary                   ║"
log "╠══════════════════════════════════════╣"
if [ $EXIT_CODE -eq 0 ]; then
  log "║ ✅ ALL STEPS PASSED                  ║"
else
  log "║ ❌ FAILED:$FAILED_STEPS"
fi
log "║ Finished: $(date)                   "
log "║ Log:     $LOG_FILE"
log "╚══════════════════════════════════════╝"

exit $EXIT_CODE
