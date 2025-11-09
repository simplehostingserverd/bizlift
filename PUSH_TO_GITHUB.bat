@echo off
echo Pushing BizLift to GitHub...
cd /d "%~dp0"

git remote add origin https://github.com/softwarepros/bizlift.git
git branch -M main
git push -u origin main

echo.
echo Done! Your repository is now at:
echo https://github.com/softwarepros/bizlift
pause
