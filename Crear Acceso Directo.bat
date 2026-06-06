@echo off

powershell -NoProfile -ExecutionPolicy Bypass "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\AfinCon Local.lnk'); $Shortcut.TargetPath = '%~dp0Iniciar AfinCon.bat'; $Shortcut.WorkingDirectory = '%~dp0'; $Shortcut.IconLocation = '%~dp0icon-loc.ico,0'; $Shortcut.Save();"

echo.
echo Acceso directo creado.
pause