$path = "c:\Users\hp\RetailStore\app\shop\page.tsx"
$c = Get-Content $path
# Lines 0..477 (keep)
# Line 478 (insert '      )}')
# Lines 479..486 (skip garbage)
# Lines 487..end (keep)

$part1 = $c[0..477]
$insertion = "      )}"
$part2 = $c[487..($c.Count - 1)]

$newContent = $part1 + $insertion + $part2
$newContent | Set-Content $path -Encoding UTF8
Write-Host "Fixed homepage syntax."
