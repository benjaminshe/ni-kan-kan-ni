#!/bin/bash

# "你看看你" 应用构建脚本
# 用途：在华为 HarmonyOS 手机上运行

echo "==================================="
echo "你看看你 - APK 构建指南"
echo "==================================="
echo ""

# 检查当前环境
echo "1. 检查构建环境..."

if [ -d "/workspace/projects" ]; then
    echo "   ✅ 沙箱环境检测到"
    echo ""
    echo "⚠️  注意：当前在沙箱环境中，无法直接构建 APK"
    echo "   请选择以下方案之一："
    echo ""
    echo "   【方案 1】使用 EAS Build（推荐）"
    echo "   - 优点：不需要本地 Android 环境，云端构建"
    echo "   - 缺点：需要注册 Expo 账户"
    echo ""
    echo "   【方案 2】本地构建"
    echo "   - 优点：完全控制，无构建次数限制"
    echo "   - 缺点：需要安装 Android SDK 和 JDK"
    echo ""
    echo "详细步骤请查看：/workspace/projects/BUILD_APK_GUIDE.md"
    echo ""
    echo "快速开始 EAS Build："
    echo "  1. npm install -g eas-cli"
    echo "  2. eas login"
    echo "  3. cd client"
    echo "  4. eas build --platform android --profile preview"
    echo ""
else
    echo "   ✅ 本地环境"
    echo ""
    echo "正在检查构建工具..."

    # 检查 Java
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1)
        echo "   ✅ Java: $JAVA_VERSION"
    else
        echo "   ❌ Java 未安装"
        echo "      请安装 JDK 17: https://adoptium.net/"
    fi

    # 检查 Android SDK
    if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
        echo "   ✅ Android SDK: $ANDROID_HOME"
    else
        echo "   ❌ Android SDK 未配置"
        echo "      请设置 ANDROID_HOME 环境变量"
    fi

    # 检查 Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo "   ✅ Node.js: $NODE_VERSION"
    else
        echo "   ❌ Node.js 未安装"
    fi

    echo ""
    echo "开始构建应用..."

    # 进入 client 目录
    cd client

    # 检查是否已经执行过 prebuild
    if [ ! -d "android" ]; then
        echo "正在生成 Android 原生项目..."
        npx expo prebuild --platform android
    fi

    # 构建调试版 APK
    echo "正在构建调试版 APK..."
    cd android
    ./gradlew assembleDebug

    if [ $? -eq 0 ]; then
        echo ""
        echo "==================================="
        echo "✅ 构建成功！"
        echo "==================================="
        echo ""
        echo "APK 文件位置："
        echo "  android/app/build/outputs/apk/debug/app-debug.apk"
        echo ""
        echo "安装到手机："
        echo "  adb install android/app/build/outputs/apk/debug/app-debug.apk"
        echo ""
    else
        echo ""
        echo "❌ 构建失败，请检查错误信息"
        echo ""
        exit 1
    fi
fi

echo "更多信息请查看：/workspace/projects/BUILD_APK_GUIDE.md"
