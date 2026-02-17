# PowerShell script to remove Supabase dependencies from TypeScript files

$files = Get-ChildItem -Path "c:\Users\hp\RetailStore\app" -Recurse -Filter "*.tsx" | 
    Select-String -Pattern "createClientComponentClient" | 
    Select-Object -ExpandProperty Path -Unique

Write-Host "Found $($files.Count) files with Supabase dependencies" -ForegroundColor Yellow

foreach ($file in $files) {
    Write-Host "Processing: $file" -ForegroundColor Cyan
    
    $content = Get-Content -Path $file -Raw
    
    # Skip if already processed (has apiClient import)
    if ($content -match "from '@/lib/api-client'") {
        Write-Host "  Already refactored, skipping" -ForegroundColor Green
        continue
    }
    
    # Remove Supabase import
    $content = $content -replace "import \{ createClientComponentClient \} from '@supabase/auth-helpers-nextjs';\r?\n", ""
    
    # Replace supabase instance creation with stub
    $content = $content -replace "const supabase = createClientComponentClient\(\);", "// Supabase removed - refactor needed"
    
    # Comment out supabase usage (basic patterns)
    $content = $content -replace "await supabase\.", "// await supabase."
    $content = $content -replace "supabase\.", "// supabase."
    
    # Write back
    Set-Content -Path $file -Value $content
    Write-Host "  Updated" -ForegroundColor Green
}

Write-Host "`nDone! Processed $($files.Count) files" -ForegroundColor Green
Write-Host "Note: Files are now commented out. Manual refactoring still needed for full functionality." -ForegroundColor Yellow
