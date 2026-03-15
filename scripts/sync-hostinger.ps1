param(
    [string]$HostingerDir,
    [string]$DistDir,
    [string]$Timestamp
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$RepoRoot = Split-Path -Parent $PSScriptRoot

if (-not $HostingerDir) {
    $HostingerDir = Join-Path $RepoRoot "Hostinger"
}

if (-not $DistDir) {
    $DistDir = Join-Path $RepoRoot "dist"
}

if (-not $Timestamp) {
    $Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
}

if (-not (Test-Path -LiteralPath $HostingerDir)) {
    throw "Hostinger directory not found: $HostingerDir"
}

if (-not (Test-Path -LiteralPath $DistDir)) {
    throw "Dist directory not found: $DistDir"
}

$distIndexPath = Join-Path $DistDir "index.html"
$distAssetsPath = Join-Path $DistDir "assets"

if (-not (Test-Path -LiteralPath $distIndexPath)) {
    throw "Dist index.html not found: $distIndexPath"
}

if (-not (Test-Path -LiteralPath $distAssetsPath)) {
    throw "Dist assets directory not found: $distAssetsPath"
}

$historyRoot = Join-Path $HostingerDir "history"
$historyPath = Join-Path $historyRoot $Timestamp
New-Item -ItemType Directory -Path $historyPath -Force | Out-Null

$hostingerIndexPath = Join-Path $HostingerDir "index.html"
$hostingerAssetsPath = Join-Path $HostingerDir "assets"

if (Test-Path -LiteralPath $hostingerIndexPath) {
    Move-Item -LiteralPath $hostingerIndexPath -Destination (Join-Path $historyPath "index.html") -Force
}

if (Test-Path -LiteralPath $hostingerAssetsPath) {
    Move-Item -LiteralPath $hostingerAssetsPath -Destination (Join-Path $historyPath "assets") -Force
}

Copy-Item -LiteralPath $distIndexPath -Destination $hostingerIndexPath -Force
Copy-Item -LiteralPath $distAssetsPath -Destination $hostingerAssetsPath -Recurse -Force

Write-Output "[OK] Hostinger refresh complete"
Write-Output "[INFO] History snapshot: $historyPath"
