#!/usr/bin/env bash
set -euo pipefail

# Start Next dev server on PORT (default 3001), wait for readiness, seed demo data, run Playwright tests, then clean up.

PORT=${PORT:-3001}
BASE_URL="http://localhost:${PORT}"
LOGFILE="/tmp/next-dev.log"

# Fast options: set SKIP_START=1 or pass --no-start to skip launching Next (useful if you already have dev server)
SKIP_START=0
FAST_MODE=0
ARGS=()
for arg in "$@"; do
  case "$arg" in
    --no-start) SKIP_START=1 ;;
    --fast) FAST_MODE=1 ;;
    *) ARGS+=("$arg") ;;
  esac
done

STARTED_NEXT=0
NEXT_PID=""

cleanup() {
  if [ "${STARTED_NEXT}" -eq 1 ] && [ -n "${NEXT_PID}" ]; then
    echo "Cleaning up Next (pid ${NEXT_PID})..."
    if ps -p ${NEXT_PID} >/dev/null 2>&1; then
      pkill -P ${NEXT_PID} >/dev/null 2>&1 || true
      kill ${NEXT_PID} >/dev/null 2>&1 || true
    fi
    npx kill-port ${PORT} >/dev/null 2>&1 || true
  fi
}

trap 'cleanup; exit 1' SIGINT SIGTERM EXIT

# If server already running, skip starting
if curl -sSf ${BASE_URL}/ >/dev/null 2>&1; then
  echo "Detected existing server at ${BASE_URL}, skipping start."
  SKIP_START=1
fi

if [ "${SKIP_START}" -eq 0 ]; then
  echo "Starting Next dev server on port ${PORT}... (logs -> ${LOGFILE})"
  nohup npm run dev > "${LOGFILE}" 2>&1 &
  NEXT_PID=$!
  STARTED_NEXT=1
  echo "Next PID: ${NEXT_PID}"

  WAIT_SECS=60
  if [ "${FAST_MODE}" -eq 1 ]; then
    WAIT_SECS=20
  fi

  echo "Waiting for ${BASE_URL} to respond (timeout ${WAIT_SECS}s)..."
  for i in $(seq 1 ${WAIT_SECS}); do
    if curl -sSf ${BASE_URL}/ >/dev/null 2>&1; then
      echo "Server is up"
      break
    fi
    sleep 1
  done

  if ! curl -sSf ${BASE_URL}/ >/dev/null 2>&1; then
    echo "Server did not become ready in time. See ${LOGFILE}"
    cleanup
    exit 1
  fi
else
  echo "Skipping server start; assuming ${BASE_URL} is available."
fi

if [ "${FAST_MODE}" -eq 1 ]; then
  echo "Fast mode enabled: reducing waits and seeding minimally."
  SEED_PAYLOAD='{"programId":"demo","hospitalId":"h1","seedExposure":true}'
else
  SEED_PAYLOAD='{"programId":"demo","hospitalId":"h1","seedExposure":true,"seedSupervisor":true}'
fi

echo "Seeding demo data via /api/test/seed..."
curl -sSf -X POST "${BASE_URL}/api/test/seed" -H "Content-Type: application/json" -d "${SEED_PAYLOAD}" || true

echo "Running Playwright tests..."
PLAYWRIGHT_BASE_URL=${BASE_URL} npx playwright test "${ARGS[@]}"
EXIT_CODE=$?

echo "Playwright finished with exit code ${EXIT_CODE}. Cleaning up..."
cleanup

# remove trap and exit with Playwright exit code
trap - SIGINT SIGTERM EXIT
exit ${EXIT_CODE}
