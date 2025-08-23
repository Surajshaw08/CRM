@echo off
echo Starting CRM Deals Module...
echo.

echo Installing dependencies...
call npm run install-all

echo.
echo Setting up database...
call npm run setup-db

echo.
echo Starting application...
call npm run dev

pause
