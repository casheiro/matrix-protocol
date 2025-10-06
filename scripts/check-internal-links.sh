#!/bin/bash

# check-internal-links.sh
# Simple script to check for broken internal links in markdown files
# Version: 0.0.1

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." &> /dev/null && pwd)"
BROKEN_LINKS=0

echo "Checking internal links in Matrix Protocol repository..."
echo "Project root: $PROJECT_ROOT"
echo ""

# Find all markdown files except in website directory
find "$PROJECT_ROOT" -name "*.md" -not -path "*/website/*" -not -path "*/.git/*" | while read -r file; do
    relative_file=${file#$PROJECT_ROOT/}
    echo "Checking: $relative_file"
    
    # Extract all markdown links [text](path)
    grep -oE '\[([^\]]*)\]\(([^)]+)\)' "$file" 2>/dev/null | while read -r link; do
        # Extract path from [text](path) or [text](path#anchor)
        path=$(echo "$link" | sed 's/.*](\([^#)]*\).*/\1/')
        
        # Skip external links
        if [[ "$path" =~ ^https?:// ]]; then
            continue
        fi
        
        # Skip empty paths or anchors only
        if [[ -z "$path" || "$path" == "#"* ]]; then
            continue
        fi
        
        # Resolve relative path
        file_dir=$(dirname "$file")
        if [[ "$path" == /* ]]; then
            # Absolute path from project root
            resolved_path="$PROJECT_ROOT${path}"
        else
            # Relative path
            resolved_path="$file_dir/$path"
        fi
        
        # Check if file exists
        if [[ ! -f "$resolved_path" ]]; then
            echo "  ❌ BROKEN: $link"
            echo "     File: $relative_file"
            echo "     Target: $path -> $resolved_path"
            ((BROKEN_LINKS++))
        fi
    done
done

echo ""
if [[ $BROKEN_LINKS -eq 0 ]]; then
    echo "✅ No broken internal links found!"
    exit 0
else
    echo "❌ Found $BROKEN_LINKS broken internal links"
    exit 1
fi