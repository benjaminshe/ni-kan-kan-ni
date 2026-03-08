@echo off
chcp 65001 >nul
echo ===================================
echo "你看看你" 项目打包脚本
echo ===================================
echo.

echo 正在创建项目压缩包...

set PROJECT_DIR=%CD%
set ZIP_FILE=%CD%\nikanikani-project.zip

echo 项目目录: %PROJECT_DIR%
echo 输出文件: %ZIP_FILE%
echo.

REM 检查是否存在 PowerShell
where powershell >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 未找到 PowerShell
    echo 请确保你使用的是 Windows 7 或更高版本
    pause
    exit /b 1
)

REM 使用 PowerShell 压缩项目
echo 正在压缩项目文件...
powershell -Command "Compress-Archive -Path '%PROJECT_DIR%\*' -DestinationPath '%ZIP_FILE%' -Force"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================
    echo ✅ 打包成功！
    echo ===================================
    echo.
    echo 压缩包位置: %ZIP_FILE%
    echo 文件大小:
    powershell -Command "(Get-Item '%ZIP_FILE%').Length / 1MB | ForEach-Object { [math]::Round($_, 2) }"
    echo.
    echo 下一步:
    echo 1. 将 nikanikani-project.zip 复制到你的 Windows 电脑
    echo 2. 解压到 D:\nikanikani\
    echo 3. 按照 LOCAL_BUILD_GUIDE.md 中的步骤构建 APK
    echo.
) else (
    echo.
    echo ===================================
    echo ❌ 打包失败
    echo ===================================
    echo.
    echo 请检查是否有足够的磁盘空间
    echo 或尝试手动复制项目文件夹
    echo.
)

pause
