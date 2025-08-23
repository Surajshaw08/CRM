Write-Host "Starting CRM Deals Module..." -ForegroundColor Green
Write-Host ""

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm run install-all

Write-Host ""
Write-Host "Setting up database..." -ForegroundColor Yellow
npm run setup-db

Write-Host ""
Write-Host "Starting application..." -ForegroundColor Yellow
npm run dev

Read-Host "Press Enter to exit"
