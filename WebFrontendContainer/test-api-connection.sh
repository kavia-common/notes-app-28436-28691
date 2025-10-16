#!/bin/bash

# Simple script to test API connectivity in CI/preview environments
# Usage: ./test-api-connection.sh

set -e

echo "=== Testing Backend API Connection ==="
echo ""

# Load environment variables if .env exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Default to localhost if not set
API_BASE_URL=${REACT_APP_API_BASE_URL:-http://localhost:3001/api/v1}
echo "Target API: $API_BASE_URL"
echo ""

# Extract base URL without /api/v1
BASE_URL=$(echo $API_BASE_URL | sed 's|/api/v1||')

# Test 1: Health endpoint
echo "1. Testing health endpoint..."
if curl -f -s -o /dev/null -w "%{http_code}" "$BASE_URL/health" | grep -q "200"; then
  echo "   ✓ Health check passed"
else
  echo "   ✗ Health check failed"
  echo "   Make sure backend is running at $BASE_URL"
  exit 1
fi

# Test 2: Auth endpoint (expect 400/422 for invalid body)
echo "2. Testing auth endpoint..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_BASE_URL/auth/login" -H "Content-Type: application/json" -d '{}')
if [ "$STATUS" = "400" ] || [ "$STATUS" = "422" ]; then
  echo "   ✓ Auth endpoint accessible (status: $STATUS)"
elif [ "$STATUS" = "200" ]; then
  echo "   ⚠ Auth endpoint returned 200 (unexpected, but accessible)"
else
  echo "   ✗ Auth endpoint returned $STATUS"
  exit 1
fi

# Test 3: Notes endpoint (expect 401 without auth)
echo "3. Testing notes endpoint..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE_URL/notes")
if [ "$STATUS" = "401" ]; then
  echo "   ✓ Notes endpoint accessible (auth required)"
elif [ "$STATUS" = "200" ]; then
  echo "   ⚠ Notes endpoint returned 200 (auth may not be enforced)"
else
  echo "   ✗ Notes endpoint returned $STATUS"
  exit 1
fi

echo ""
echo "=== All API connection tests passed! ==="
echo "Backend is accessible at $API_BASE_URL"
exit 0
