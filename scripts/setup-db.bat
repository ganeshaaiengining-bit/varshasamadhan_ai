# batch file

@echo off
title Database setup - Varsha Samadhan
color 0E

echo.
echo  ==============================================
echo    Database setup
echo  ==============================================
echo.
echo  Sirf ek kaam: browser me Neon kholein aur link copy karein.
echo  Phir WAPAS yahan aayein aur Enter dabaein.
echo.
echo  Link chat me KABHI mat likhein.
echo.
echo  -------------------------------------------------------
echo.

set /p go="  Link copy kar liya? Enter dabaein... "

if "%go%"=="" goto retry

python "%~dp0set-db-from-clipboard.py"
if errorlevel 1 goto retry

echo.
echo  ==============================================
echo    Ho gaya!
echo  ==============================================
echo.
pause
exit /b

:retry
echo.
echo  Link copy nahi mili. Dobara try karein.
echo.
pause
goto start