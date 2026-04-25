$ErrorActionPreference = 'Stop'
$terms = @(
  'millet farm',
  'terrace farming',
  'himalaya farmer',
  'mountain agriculture',
  'grain harvest'
)

foreach ($t in $terms) {
  $q = [System.Uri]::EscapeDataString($t)
  $api = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$q&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&format=json"
  Write-Host "TERM: $t"
  try {
    $res = Invoke-RestMethod -Uri $api -TimeoutSec 40
    if ($res.query.pages) {
      foreach ($p in $res.query.pages.PSObject.Properties.Value) {
        if ($p.imageinfo -and $p.imageinfo[0] -and $p.imageinfo[0].url) {
          $url = $p.imageinfo[0].url
          Write-Host ($p.title + ' => ' + $url)
        }
      }
    } else {
      Write-Host 'No results'
    }
  } catch {
    Write-Host ('FAILED: ' + $_.Exception.Message)
  }
  Write-Host '---'
}
