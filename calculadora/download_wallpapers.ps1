# Script para descargar wallpapers a la carpeta `calculadora/assets`
# Ejecuta desde PowerShell:
# cd 'C:\Users\Carlo\Desktop\TALLER-JORNADA25\calculadora'
# .\download_wallpapers.ps1

$dest = Join-Path -Path $PSScriptRoot -ChildPath 'assets'
if (-not (Test-Path $dest)) { New-Item -Path $dest -ItemType Directory | Out-Null }

$files = @(
  @{ url = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80'; name = 'mountains.jpg' },
  @{ url = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'; name = 'beach.jpg' },
  @{ url = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80'; name = 'forest.jpg' },
  @{ url = 'https://images.unsplash.com/photo-1444090542259-0af8fa96557e?auto=format&fit=crop&w=1600&q=80'; name = 'night.jpg' }
)

foreach ($f in $files) {
  $out = Join-Path $dest $($f.name)
  Write-Host "Descargando $($f.name) ..."
  try {
    Invoke-WebRequest -Uri $f.url -OutFile $out -UseBasicParsing -Headers @{ 'User-Agent' = 'Mozilla/5.0' }
    Write-Host "Guardado -> $out"
  } catch {
    Write-Warning "Error descargando $($f.url): $_"
  }
}

Write-Host "Descarga finalizada. Asegúrate de abrir 'calculadora/index.html' desde el sistema de archivos (no desde `file://` bloqueado por CORS)."