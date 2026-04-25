$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

$images = @{
    "assets/images/hero/hero-field.jpg" = @(
        "https://live.staticflickr.com/4089/5210239773_758a16661d_b.jpg"
    )
    "assets/images/hero/farmers-network.jpg" = @(
        "https://live.staticflickr.com/65535/49693288473_7eb7984f85_b.jpg"
    )
    "assets/images/products/finger-millet.jpg" = @(
        "https://live.staticflickr.com/6010/5900833762_49cd077318_b.jpg"
    )
    "assets/images/products/barnyard-millet.jpg" = @(
        "https://live.staticflickr.com/3078/3131617016_e83b304ddd_b.jpg"
    )
    "assets/images/products/millet-flour.jpg" = @(
        "https://live.staticflickr.com/8472/8411801273_c1792de2a5_b.jpg"
    )
    "assets/images/gallery/gallery-1.jpg" = @(
        "https://live.staticflickr.com/2901/13947870691_f194cce7dc_b.jpg"
    )
    "assets/images/gallery/gallery-2.jpg" = @(
        "https://live.staticflickr.com/7381/9220148369_f6cc510672_b.jpg"
    )
    "assets/images/gallery/gallery-3.jpg" = @(
        "https://live.staticflickr.com/2588/4199920565_8ac3971d3e_b.jpg"
    )
}

Write-Host ""
Write-Host "Downloading images..."

$ok = 0
$failed = 0

foreach ($path in $images.Keys) {
    $dir = Split-Path $path -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    Write-Host ("- " + (Split-Path $path -Leaf) + " ...") -NoNewline
    $downloaded = $false
    foreach ($url in $images[$path]) {
        try {
            Invoke-WebRequest -Uri $url -OutFile $path -TimeoutSec 30 -Headers @{"User-Agent"="Mozilla/5.0";"Accept"="image/*"}
            $downloaded = $true
            break
        }
        catch {
            # Try next fallback URL.
        }
    }

    if ($downloaded) {
        Write-Host " OK"
        $ok++
    }
    else {
        Write-Host " FAILED"
        $failed++
    }
}

Write-Host ""
Write-Host ("Completed: " + $ok + " success, " + $failed + " failed")

if ($failed -gt 0) {
    exit 1
}

exit 0
