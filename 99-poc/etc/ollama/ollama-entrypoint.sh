#!/bin/sh
set -e

echo "Starting Ollama server"
ollama serve &
SERVER_PID=$!

echo "Waiting for Ollama server to be ready"
sleep 5

echo "Pulling nomic-embed-text model"
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if ollama pull nomic-embed-text; then
        echo "nomic-embed-text model pulled successfully!"
        break
    else
        echo "Attempt $RETRY_COUNT: Server not ready yet, waiting"
        sleep 5
        RETRY_COUNT=$((RETRY_COUNT + 1))
    fi
done

if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo "Failed to pull nomic-embed-text model after $MAX_RETRIES attempts."
fi

echo "Server is now running and ready to use"
wait $SERVER_PID
