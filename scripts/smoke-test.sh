#!/bin/bash
set -euo pipefail

echo "Running smoke tests..."

UI_URL="${UI_URL:-http://localhost:3000}"
API_URL="${API_URL:-http://localhost:8080}"

if curl --output /dev/null --silent --fail "$UI_URL"; then
  echo "UI is accessible at $UI_URL"
else
  echo "UI is not accessible at $UI_URL" >&2
  exit 1
fi

if curl --output /dev/null --silent --fail "$API_URL/health"; then
  echo "API is accessible at $API_URL/health"
else
  echo "API is not accessible at $API_URL/health" >&2
  exit 1
fi

echo "Smoke tests passed!"
