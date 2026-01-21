$status = git status --porcelain
foreach ($line in $status) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    # format is "xy filename" where x,y are status codes. filename starts at index 3
    $file = $line.Substring(3).Trim()
    # Remove quotes if present (git quotes filenames with spaces)
    $file = $file -replace '^"|"$', ""
    
    Write-Host "Committing: $file"
    git add "$file"
    git commit -m "feat: updates for $file to complete migration"
}
