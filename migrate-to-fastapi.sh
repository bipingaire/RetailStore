#!/bin/bash

# Supabase to FastAPI Migration Helper
# Automatically updates import statements in TypeScript/TSX files

echo "🚀 Starting Supabase to FastAPI Migration..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Counter
total=0
updated=0

# Find all TypeScript files with Supabase imports
echo -e "${BLUE}Finding files with Supabase imports...${NC}"

# Replace Supabase imports with API client
find app lib -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "@supabase" {} \; | while read file; do
    total=$((total + 1))
    echo -e "${BLUE}Processing: $file${NC}"
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Replace import statement
    sed -i "s/import { createClientComponentClient } from '@supabase\/auth-helpers-nextjs';/import { apiClient } from '@\/lib\/api-client';/g" "$file"
    sed -i "s/const supabase = createClientComponentClient();/\/\/ Using apiClient instead of Supabase/g" "$file"
    
    # Check if file was modified
    if ! cmp -s "$file" "$file.backup"; then
        echo -e "${GREEN}✓ Updated: $file${NC}"
        updated=$((updated + 1))
        rm "$file.backup"
    else
        echo "  No changes needed"
        rm "$file.backup"
    fi
done

echo -e "\n${GREEN}✅ Migration complete!${NC}"
echo "Total files processed: $total"
echo "Files updated: $updated"
echo ""
echo "⚠️  Manual review required for:"
echo "  - Supabase query conversions (.from() -> apiClient methods)"
echo "  - Auth checks (.auth.getUser() -> apiClient.getCurrentUser())"
echo "  - File uploads (.storage -> apiClient.uploadFile())"
