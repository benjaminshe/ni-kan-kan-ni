@echo off
chcp 65001 >nul
echo ========================================
echo    你看看你 - 一键构建脚本
echo ========================================
echo.

echo [1/5] 检查环境...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Node.js，请先安装 Node.js
    echo 下载地址：https://nodejs.org/
    pause
    exit /b 1
)
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Java，请先安装 Java
    echo 下载地址：https://adoptium.net/temurin/releases/?version=17
    pause
    exit /b 1
)
where adb >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  未检测到 adb，构建完成后可能无法自动安装
    echo 请确保已安装 Android Studio
)
echo ✅ 环境检查通过
echo.

echo [2/5] 安装项目依赖...
cd /d "%~dp0"
call pnpm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)
echo ✅ 依赖安装完成
echo.

echo [3/5] 生成 Android 项目...
cd client
call npx expo prebuild --platform android
if %errorlevel% neq 0 (
    echo ❌ 项目生成失败
    pause
    exit /b 1
)
echo ✅ Android 项目生成完成
echo.

echo [4/5] 构建 APK（这可能需要 20-40 分钟，请耐心等待）...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ❌ APK 构建失败
    pause
    exit /b 1
)
echo ✅ APK 构建完成
echo.

echo [5/5] APK 文件位置：
cd /d "%~dp0"
echo %~dp0client\android\app\build\outputs\apk\debug\app-debug.apk
echo.

echo ========================================
echo    构建完成！
echo ========================================
echo.
echo APK 文件已生成，现在可以安装到手机了
echo.
echo 如何安装：
echo 1. 将 APK 文件复制到手机
echo 2. 在手机上点击安装
echo 3. 允许安装未知应用
echo.
echo 按任意键打开 APK 所在文件夹...
pause >nul
explorer "%~dp0client\android\app\build\outputs\apk\debug"
