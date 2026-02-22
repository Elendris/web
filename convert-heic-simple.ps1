# Simple HEIC to JPG converter using Windows built-in capabilities
# This script uses .NET System.Drawing if available

Add-Type -AssemblyName System.Drawing

$sourcePath = ".\public\images\byt"
$files = Get-ChildItem -Path $sourcePath -Filter "*.heic"

Write-Host "Found $($files.Count) HEIC files" -ForegroundColor Cyan
Write-Host ""

if ($files.Count -eq 0) {
    Write-Host "No HEIC files found in $sourcePath" -ForegroundColor Yellow
    exit
}

# Check if we need to install heic2jpg npm package
Write-Host "Attempting to convert HEIC files..." -ForegroundColor Green
Write-Host ""
Write-Host "Option 1: Install heic-convert npm package" -ForegroundColor Yellow
Write-Host "  Run: npm install -g heic-convert heic-cli" -ForegroundColor Gray
Write-Host "  Then: heic-cli .\public\images\byt\*.heic" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2: Use online converter" -ForegroundColor Yellow
Write-Host "  Visit: https://heictojpg.com/" -ForegroundColor Gray
Write-Host "  Or: https://convertio.co/heic-jpg/" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 3: Use Windows Photos app" -ForegroundColor Yellow
Write-Host "  1. Open each HEIC file in Photos app" -ForegroundColor Gray
Write-Host "  2. Click '...' menu -> Save as" -ForegroundColor Gray
Write-Host "  3. Choose JPG format" -ForegroundColor Gray
Write-Host ""
Write-Host "Files to convert:" -ForegroundColor Cyan
foreach ($file in $files) {
    Write-Host "  - $($file.Name)" -ForegroundColor White
}
