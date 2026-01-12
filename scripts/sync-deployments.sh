#!/bin/bash

# Sync deployments.json from docs/ to src/data/ and static/
# This keeps all three files in sync, with docs/deployments.json as the source of truth

SOURCE="docs/deployments.json"
DEST1="src/data/deployments.json"
DEST2="static/deployments.json"

if [ ! -f "$SOURCE" ]; then
    echo "Error: Source file $SOURCE not found!"
    exit 1
fi

cp "$SOURCE" "$DEST1"
cp "$SOURCE" "$DEST2"

echo "✓ Synced deployments.json to:"
echo "  - $DEST1"
echo "  - $DEST2"
