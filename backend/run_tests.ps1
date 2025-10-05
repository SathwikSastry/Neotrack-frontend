# Run backend pytest in PowerShell
if (-not (Test-Path ".venv")) {
  Write-Host "Virtualenv not found. Creating .venv and installing requirements..."
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
}
.\.venv\Scripts\Activate.ps1; pytest -q
