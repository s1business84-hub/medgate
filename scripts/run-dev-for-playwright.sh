#!/usr/bin/env bash
set -euo pipefail

PORT=${PORT:-3001}
BASE_URL="http://localhost:${PORT}"
LOGFILE="/tmp/playwright-next.log"

echo "Starting Next dev for Playwright on ${BASE_URL} (logs -> ${LOGFILE})"
# Pass the port to Next explicitly to avoid defaulting to 3000
nohup npm run dev -- -p ${PORT} > "${LOGFILE}" 2>&1 &
NEXT_PID=$!
echo "Next PID ${NEXT_PID} started"

WAIT_SECS=${WAIT_SECS:-120}
for i in $(seq 1 ${WAIT_SECS}); do
  if curl -sSf ${BASE_URL}/ >/dev/null 2>&1; then
    echo "Next is up"
    exit 0
  fi
  sleep 1
done

echo "Next did not become ready within ${WAIT_SECS}s. Dumping last 200 lines of log:" >&2
tail -n 200 "${LOGFILE}" >&2 || true
kill ${NEXT_PID} >/dev/null 2>&1 || true
exit 1
