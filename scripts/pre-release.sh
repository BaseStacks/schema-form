#!/bin/bash

set -e  # Exit on error

SERVER_PORT=3000
SERVER_PID=$(lsof -i :$SERVER_PORT | grep LISTEN | awk '{print $2}') 
# Exit if the server is already running
if [ -n "$SERVER_PID" ]; then
  echo "❌ Server is already running on port $SERVER_PORT. Please stop it before running this script."
  exit 1
fi

# Define a function to handle cleanup on exit
stop_server() {
  echo "🛑 Stopping examples server..."
  lsof -i :$SERVER_PORT | grep LISTEN | awk '{print $2}' | xargs kill -9 || true
}

echo "🔍 Running pre-release checks..."

echo "Step 1: Running linter"
pnpm lint
echo "✅ Linting passed"

echo "Step 2: Running Jest tests"
pnpm test
echo "✅ Jest tests passed"

echo "Step 3: Build and run API Extractor checks"
pnpm api-extractor:ci
echo "✅ Build successful"

echo "Step 4: Starting examples server"
# Create a log file for server output
LOG_FILE="server.log"
# Start server in background and capture PID
pnpm start > "$LOG_FILE" 2>&1 &

# Wait for server to be ready by checking for "webpack compiled successfully" message
echo "Waiting for server to be ready..."
TIMEOUT_COUNTER=0
MAX_TIMEOUT=60  # 60 seconds timeout
while ! grep -q "webpack compiled successfully" "$LOG_FILE"; do
  # Check if timeout has been reached
  if [ $TIMEOUT_COUNTER -ge $MAX_TIMEOUT ]; then
    echo "❌ Server startup timed out after $MAX_TIMEOUT seconds"
    stop_server
    exit 1
  fi
  sleep 1
  TIMEOUT_COUNTER=$((TIMEOUT_COUNTER + 1))
done
echo "✅ Server ready!"

echo "Step 5: Running E2E tests"
pnpm run e2e
echo "✅ E2E tests passed"

echo "Step 6: Stopping examples server"
stop_server
rm -f "$LOG_FILE"
echo "🛑 Examples server stopped"

echo "🎉 Pre-release checks completed successfully!"
