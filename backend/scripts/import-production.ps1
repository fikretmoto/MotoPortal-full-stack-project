param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$CsvPath
)

$ErrorActionPreference = "Stop"

$BackendRoot = Split-Path -Parent $PSScriptRoot
Set-Location $BackendRoot

$EnvFile = Join-Path $BackendRoot ".env.production-import"

function Get-DatabaseUrlFromEnvFile {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        return $null
    }

    $line = Get-Content $Path |
        Where-Object { $_ -match '^\s*DATABASE_URL\s*=' } |
        Select-Object -First 1

    if (-not $line) {
        return $null
    }

    return ($line -replace '^\s*DATABASE_URL\s*=\s*', '').Trim()
}

$databaseUrl = Get-DatabaseUrlFromEnvFile -Path $EnvFile

if (-not $databaseUrl) {
    $clipboardValue = Get-Clipboard -Raw

    if ($clipboardValue -match '^\s*postgres(?:ql)?://') {
        $databaseUrl = $clipboardValue.Trim()

        Set-Content `
            -Path $EnvFile `
            -Value "DATABASE_URL=$databaseUrl" `
            -Encoding UTF8

        Write-Host ""
        Write-Host "Production DATABASE_URL kaydedildi."
        Write-Host ".env.production-import Git'e GONDERILMEMELI."
        Write-Host ""
    }
    else {
        Write-Host ""
        Write-Host "ILK KURULUM:"
        Write-Host "1. Render > motoportal-db"
        Write-Host "2. External Database URL satirinda Copy"
        Write-Host "3. Bu komutu tekrar calistir"
        Write-Host ""

        throw "Production DATABASE_URL ayarlanmamis."
    }
}

if ($databaseUrl -notmatch '^\s*postgres(?:ql)?://') {
    throw ".env.production-import icindeki DATABASE_URL gecersiz."
}

$env:DATABASE_URL = $databaseUrl

python manage.py import_products_production $CsvPath

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}