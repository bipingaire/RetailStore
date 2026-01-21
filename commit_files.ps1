$status = git status --porcelain
foreach ($line in $status) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    # Skip the first 3 characters (status flags) and trim potential quotes
    $file = $line.Substring(3).Trim('"')
    
    # Check if file exists (handling potential renames or deletes logic if needed, but simple add works for most)
    Write-Host "Committing: $file"
    git add "$file"
    git commit -m "Update/Refactor $file"
}
