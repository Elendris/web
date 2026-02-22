# PowerShell script to convert HEIC images to JPG
# Requires Windows 10/11 with HEIF Image Extensions installed

$sourcePath = ".\public\images\byt"
$files = Get-ChildItem -Path $sourcePath -Filter "*.heic"

Write-Host "Found $($files.Count) HEIC files to convert"

foreach ($file in $files) {
    $outputName = [System.IO.Path]::ChangeExtension($file.Name, ".jpg")
    $outputPath = Join-Path $sourcePath $outputName
    
    Write-Host "Converting $($file.Name) to $outputName..."
    
    # Using magick (ImageMagick) if available
    try {
        magick convert "$($file.FullName)" -quality 85 "$outputPath"
        Write-Host "  ✓ Converted successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ ImageMagick not found. Please install ImageMagick or use online converter" -ForegroundColor Yellow
        Write-Host "  Alternative: Use https://convertio.co/heic-jpg/ or https://heictojpg.com/" -ForegroundColor Cyan
        break
    }
}

Write-Host "`nConversion complete!" -ForegroundColor Green
