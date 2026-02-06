#!/usr/bin/env node

/**
 * This script identifies all files in the codebase that are creating
 * their own Supabase client instances instead of using the centralized singleton.
 * 
 * Run this to see which files still need to be fixed.
 */

const fs = require('fs');
const path = require('path');

const problematicPatterns = [
    /const\s+supabase\s*=\s*createClient\(/,
    /import\s+{\s*createClient\s*}\s+from\s+['"]@supabase\/supabase-js['"]/,
    /createClientComponentClient\(\)/
];

const excludeDirs = ['node_modules', '.next', 'dist', 'build'];

function findProblematicFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                findProblematicFiles(filePath, fileList);
            }
        } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
            const content = fs.readFileSync(filePath, 'utf8');

            // Skip if already importing from lib/supabase
            if (content.includes("from '@/lib/supabase'") || content.includes("from './supabase'")) {
                return;
            }

            const hasIssue = problematicPatterns.some(pattern => pattern.test(content));

            if (hasIssue) {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

console.log('🔍 Scanning for files with duplicate Supabase client instances...\n');

const problematicFiles = findProblematicFiles(process.cwd());

if (problematicFiles.length === 0) {
    console.log('✅ No issues found! All files are using the centralized Supabase client.');
} else {
    console.log(`❌ Found ${problematicFiles.length} file(s) that need to be updated:\n`);
    problematicFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${path.relative(process.cwd(), file)}`);
    });
    console.log('\n💡 These files should import from @/lib/supabase instead of creating new clients.');
}
