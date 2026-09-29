<#
.SYNOPSIS
    Production Postgres veritabanina (backend/.env.production) baglanarak
    verilen bir "python manage.py <komut>" komutunu calistirir.

.DESCRIPTION
    backend/.env, gunluk gelistirme icin YEREL veritabanina (local
    PostgreSQL, bkz. backend/.env icindeki DATABASE_URL) bagli olacak
    sekilde ayarlanmistir. Production'a (motoportal.com.tr'nin
    kullandigi Render Postgres, motoportal_db_v2) bilerek baglanmak
    icin backend/.env DEGIL, sadece bu script kullanilmalidir.

    Bu script backend/.env.production dosyasindan DATABASE_URL (ve
    varsa CLOUDINARY_URL) degerlerini okur, calistirmadan once buyuk
    bir uyari gosterir ve kullanicidan "evet" yazarak onay ister.
    Onaylanmazsa islem iptal edilir, hicbir komut calismaz.

    ONEMLI: Bu script'in kendisi Git'e commit edilebilir (icinde
    sifre/URL yok, sadece dosyadan okuyor) ama backend/.env.production
    dosyasinin KENDISI ASLA Git'e commit edilmemelidir (.gitignore'da
    olmali) -- icinde gercek production sifresi var.

    NOT: Read-Host ile interaktif onay istedigi icin bu script
    otomatik/non-interaktif bir ortamdan (ornegin bir CI adimindan
    veya Claude Code'un kendi arac cagrilarindan) calistirilamaz --
    bilerek boyle tasarlandi, sadece gercek bir kullanicinin kendi
    terminalinde elle calistirmasi icindir.

.PARAMETER ManageArgs
    python manage.py'a oldugu gibi iletilecek argumanlar.

.EXAMPLE
    .\scripts\run_production.ps1 import_products import_templates/mondial_125cc_scooter_6model.csv

.EXAMPLE
    .\scripts\run_production.ps1 shell -c "from apps.catalog.models import Product; print(Product.objects.count())"

.EXAMPLE
    .\scripts\run_production.ps1 migrate
#>

param(
    [Parameter(Mandatory = $true, ValueFromRemainingArguments = $true)]
    [string[]]$ManageArgs
)

$ErrorActionPreference = "Stop"

$BackendRoot = Split-Path -Parent $PSScriptRoot
Set-Location $BackendRoot

$EnvFile = Join-Path $BackendRoot ".env.production"

if (-not (Test-Path $EnvFile)) {
    throw "backend/.env.production bulunamadi. Once bu dosyayi olusturup icine production DATABASE_URL'ini yazmalisin."
}

function Get-EnvValue {
    param(
        [string]$Path,
        [string]$Key
    )

    $line = Get-Content $Path |
        Where-Object { $_ -match "^\s*$Key\s*=" } |
        Select-Object -First 1

    if (-not $line) {
        return $null
    }

    return ($line -replace "^\s*$Key\s*=\s*", "").Trim()
}

$databaseUrl = Get-EnvValue -Path $EnvFile -Key "DATABASE_URL"
$cloudinaryUrl = Get-EnvValue -Path $EnvFile -Key "CLOUDINARY_URL"

if (-not $databaseUrl -or $databaseUrl -notmatch '^\s*postgres(?:ql)?://') {
    throw ".env.production icinde gecerli bir DATABASE_URL bulunamadi."
}

Write-Host ""
Write-Host "================================================================" -ForegroundColor Red
Write-Host "   UYARI   PRODUCTION VERITABANINA BAGLANIYORSUNUZ   UYARI" -ForegroundColor Red
Write-Host "================================================================" -ForegroundColor Red
Write-Host ""
Write-Host "  Calistirilacak komut:" -ForegroundColor Yellow
Write-Host "    python manage.py $($ManageArgs -join ' ')" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Bu islem GERCEK, CANLI motoportal.com.tr veritabaninda" -ForegroundColor Red
Write-Host "  calisacak (motoportal_db_v2). Geri alinamayabilir." -ForegroundColor Red
Write-Host ""
Write-Host "================================================================" -ForegroundColor Red
Write-Host ""

$confirmation = Read-Host 'Devam etmek icin tam olarak "evet" yazin'

if ($confirmation -ne "evet") {
    Write-Host "Iptal edildi -- hicbir komut calistirilmadi." -ForegroundColor Cyan
    exit 1
}

$env:DATABASE_URL = $databaseUrl
if ($cloudinaryUrl) {
    $env:CLOUDINARY_URL = $cloudinaryUrl
}

python manage.py @ManageArgs

exit $LASTEXITCODE
