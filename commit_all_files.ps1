# Script to commit each file individually
# This will create ~270 commits (deleted + added files)

# Get all changed files
$deletedFiles = git ls-files --deleted
$modifiedFiles = git diff --name-only
$untrackedFiles = git ls-files --others --exclude-standard

Write-Host "Files to commit:" -ForegroundColor Cyan
Write-Host "  Deleted: $($deletedFiles.Count)" -ForegroundColor Red
Write-Host "  Modified: $($modifiedFiles.Count)" -ForegroundColor Yellow  
Write-Host "  New: $($untrackedFiles.Count)" -ForegroundColor Green
Write-Host "  Total: $(($deletedFiles.Count + $modifiedFiles.Count + $untrackedFiles.Count))" -ForegroundColor White
Write-Host ""

$commitCount = 0

# Commit deleted files (Supabase migrations)
Write-Host "Committing deleted files..." -ForegroundColor Red
foreach ($file in $deletedFiles) {
    if ($file) {
        git add $file 2>$null
        $fileName = Split-Path $file -Leaf
        git commit -m "Remove: $fileName" --quiet
        $commitCount++
        if ($commitCount % 10 -eq 0) {
            Write-Host "  Progress: $commitCount commits created" -ForegroundColor Gray
        }
    }
}

# Commit modified files
Write-Host "Committing modified files..." -ForegroundColor Yellow
foreach ($file in $modifiedFiles) {
    if ($file) {
        git add $file
        $fileName = Split-Path $file -Leaf
        $action = "Update"
        if ($file -like "*/package.json") { $action = "Remove Supabase deps from" }
        if ($file -like "*/models/*") { $action = "Add/Update" }
        $message = "$action" + ": $fileName"
        git commit -m $message --quiet
        $commitCount++
        if ($commitCount % 10 -eq 0) {
            Write-Host "  Progress: $commitCount commits created" -ForegroundColor Gray
        }
    }
}

# Commit new files (backend)
Write-Host "Committing new files..." -ForegroundColor Green
foreach ($file in $untrackedFiles) {
    if ($file -and $file -notlike "*.log" -and $file -notlike "node_modules/*") {
        git add $file
        $fileName = Split-Path $file -Leaf
        $action = "Add"
        if ($file -like "*backend/*") { $action = "Backend: Add" }
        if ($file -like "*.md") { $action = "Docs: Add" }
        $message = "$action" + ": $fileName"
        git commit -m $message --quiet
        $commitCount++
        if ($commitCount % 10 -eq 0) {
            Write-Host "  Progress: $commitCount commits created" -ForegroundColor Gray
        }
    }
}

Write-Host ""
Write-Host "Complete! Total commits created: $commitCount" -ForegroundColor Green
git log --oneline -n 5
