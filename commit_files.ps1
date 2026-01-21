$files = git status --porcelain | ForEach-Object { $_.Substring(3) }

foreach ($file in $files) {
    if ($file -ne "") {
        Write-Host "Committing $file..."
        git add "$file"
        $filename = Split-Path $file -Leaf
        git commit -m "Update $filename"
    }
}
Write-Host "All files committed."
