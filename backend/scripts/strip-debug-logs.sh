#!/bin/bash
# Detect and report debug logging in source code before production build
# Does NOT auto-delete — reports issues for developer review
set -euo pipefail

SRC_DIR="${1:-src}"
REPORT_FILE="debug-log-report.txt"
ISSUES=0

echo "========================================"   | tee $REPORT_FILE
echo "  Debug Log Audit — $(date)"                | tee -a $REPORT_FILE
echo "  Scanning: $SRC_DIR"                       | tee -a $REPORT_FILE
echo "========================================"   | tee -a $REPORT_FILE

scan() {
  local PATTERN="$1"
  local DESC="$2"
  local RESULTS
  RESULTS=$(grep -rn --include="*.js" --include="*.ts" \
    --exclude-dir=node_modules \
    --exclude-dir=".next" \
    --exclude-dir=dist \
    --exclude="*.test.*" \
    --exclude="*.spec.*" \
    "$PATTERN" "$SRC_DIR" 2>/dev/null || true)
  
  if [ -n "$RESULTS" ]; then
    echo "" | tee -a $REPORT_FILE
    echo "  ⚠️  $DESC:" | tee -a $REPORT_FILE
    echo "$RESULTS" | while IFS= read -r line; do
      echo "     $line" | tee -a $REPORT_FILE
      ISSUES=$((ISSUES+1))
    done
  fi
}

scan "console\.log\("          "console.log (remove or replace with logger)"
scan "console\.debug\("        "console.debug (remove before production)"
scan "console\.trace\("        "console.trace (remove before production)"
scan "debugger;"               "debugger statement (MUST remove)"
scan "TODO\|FIXME\|HACK\|XXX"  "TODO/FIXME comments (review before production)"

echo "" | tee -a $REPORT_FILE
echo "========================================"   | tee -a $REPORT_FILE
echo "  Scan complete. Report: $REPORT_FILE"      | tee -a $REPORT_FILE
