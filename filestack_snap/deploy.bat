@echo off
echo 🚀 Starting Snap Filestack deployment...

REM Create deployment directory
set DEPLOY_DIR=snap-filestack-deploy
echo 📁 Creating deployment directory: %DEPLOY_DIR%
if not exist %DEPLOY_DIR% mkdir %DEPLOY_DIR%

REM Copy necessary files
echo 📄 Copying files for deployment...
copy index.html %DEPLOY_DIR%\ >nul
copy styles.css %DEPLOY_DIR%\ >nul
copy script.js %DEPLOY_DIR%\ >nul
if exist ai-code-generator.html copy ai-code-generator.html %DEPLOY_DIR%\ >nul
if exist simple-ai-generator.html copy simple-ai-generator.html %DEPLOY_DIR%\ >nul
if exist example_page.html copy example_page.html %DEPLOY_DIR%\ >nul

REM Copy documentation folder
if exist complete_filestack_js (
    echo 📚 Copying documentation folder...
    xcopy complete_filestack_js %DEPLOY_DIR%\complete_filestack_js /E /I /Q >nul
) else (
    echo ⚠️ complete_filestack_js folder not found
)

REM Create deployment README
echo # Snap Filestack - Deployed Version > %DEPLOY_DIR%\README.md
echo. >> %DEPLOY_DIR%\README.md
echo This folder contains the production-ready files for Snap Filestack. >> %DEPLOY_DIR%\README.md
echo. >> %DEPLOY_DIR%\README.md
echo ## Files included: >> %DEPLOY_DIR%\README.md
echo - index.html - Main application >> %DEPLOY_DIR%\README.md
echo - styles.css - Styling >> %DEPLOY_DIR%\README.md
echo - script.js - JavaScript functionality >> %DEPLOY_DIR%\README.md
echo - ai-code-generator.html - Standalone AI generator >> %DEPLOY_DIR%\README.md
echo - simple-ai-generator.html - Simple AI generator >> %DEPLOY_DIR%\README.md
echo - complete_filestack_js/ - Documentation for AI search >> %DEPLOY_DIR%\README.md
echo. >> %DEPLOY_DIR%\README.md
echo See DEPLOYMENT.md for detailed instructions. >> %DEPLOY_DIR%\README.md

echo ✅ Deployment files ready in: %DEPLOY_DIR%\
echo.
echo 📋 Next steps:
echo 1. Upload the contents of '%DEPLOY_DIR%' to your web host
echo 2. Configure your DNS (see DEPLOYMENT.md)
echo 3. Set up production Qdrant database
echo 4. Update Qdrant URLs in script.js
echo.
echo 🌐 Your site will be live at: https://yourdomain.com

pause