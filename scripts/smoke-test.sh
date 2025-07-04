#!/bin/bash

# Script to perform smoke tests after deployment

echo "Running smoke tests..."

# Check UI accessibility
UI_URL=$(minikube service ui-service --url)
if curl --output /dev/null --silent --head --fail "$UI_URL"; then
  echo "UI is accessible at $UI_URL"
else
  echo "UI is not accessible at $UI_URL"
  exit 1
fi

# Check API accessibility
API_URL=$(minikube service api-service --url)
if curl --output /dev/null --silent --head --fail "$API_URL/health"; then
  echo "API is accessible at $API_URL/health"
else
  echo "API is not accessible at $API_URL/health"
  exit 1
fi

echo "Smoke tests passed!"
