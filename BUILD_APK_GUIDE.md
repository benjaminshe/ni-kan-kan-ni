# "你看看你" 应用 APK 构建指南

本指南将帮助你在华为 HarmonyOS 4.2.136 手机上安装"你看看你"应用。

## ⚠️ 重要说明

**在当前的沙箱环境中无法直接构建 APK 文件**，构建 APK 需要以下环境：
- Android SDK
- Java Development Kit (JDK) 17 或更高版本
- Android 构建工具链
- 应用签名密钥

## 构建方案对比

### 方案 1：使用 EAS Build（推荐）

**优点：**
- ✅ 不需要本地 Android SDK
- ✅ 在云端构建，简单快捷
- ✅ Expo 官方支持
- ✅ 自动处理签名

**缺点：**
- ❌ 需要注册 Expo 账户
- ❌ 免费账户每月构建次数有限制

**适用场景：** 没有本地 Android 开发环境的用户

### 方案 2：本地构建

**优点：**
- ✅ 完全控制构建过程
- ✅ 无构建次数限制
- ✅ 可以自定义配置

**缺点：**
- ❌ 需要安装完整的 Android SDK 和 JDK
- ❌ 配置复杂
- ❌ 占用大量磁盘空间

**适用场景：** 有开发经验，需要频繁构建的用户

---

## 方案 1：使用 EAS Build 构建 APK

### 步骤 1：注册 Expo 账户

1. 访问 [Expo 官网](https://expo.dev)
2. 注册账户
3. 登录后获取账户信息

### 步骤 2：安装 EAS CLI

```bash
npm install -g eas-cli
```

### 步骤 3：登录 Expo

```bash
eas login
```

### 步骤 4：配置 EAS

在项目根目录创建 `eas.json` 文件：

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### 步骤 5：构建 APK

```bash
# 进入 client 目录
cd /workspace/projects/client

# 构建预览版 APK（推荐）
eas build --platform android --profile preview

# 或者构建生产版 APK
eas build --platform android --profile production
```

### 步骤 6：下载 APK

1. 构建完成后，Expo 会提供下载链接
2. 在浏览器中打开链接
3. 下载 `nikanikani.apk` 文件

---

## 方案 2：本地构建 APK

### 步骤 1：安装依赖工具

#### 1.1 安装 JDK 17

下载并安装 [JDK 17](https://adoptium.net/)

#### 1.2 安装 Android SDK

下载并安装 [Android Studio](https://developer.android.com/studio)

#### 1.3 配置环境变量

设置以下环境变量：

```bash
export JAVA_HOME=/path/to/jdk-17
export ANDROID_HOME=/path/to/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### 步骤 2：安装必要的 Android SDK 组件

使用 Android SDK Manager 安装：
- Android SDK Build-Tools 34.0.0
- Android SDK Platform 34
- Android SDK Platform-Tools
- Android Emulator

### 步骤 3：生成本地 Android 项目

```bash
cd /workspace/projects/client

# 生成 Android 原生代码
npx expo prebuild --platform android

# 这将创建 android/ 目录
```

### 步骤 4：使用 Gradle 构建 APK

```bash
cd android

# 构建调试版 APK
./gradlew assembleDebug

# APK 文件位置：app/build/outputs/apk/debug/app-debug.apk

# 构建发布版 APK（需要签名）
./gradlew assembleRelease

# APK 文件位置：app/build/outputs/apk/release/app-release.apk
```

### 步骤 5：签名 APK（发布版）

#### 5.1 生成签名密钥

```bash
keytool -genkeypair -v -keystore nikanikani-release.keystore -alias nikanikani -keyalg RSA -keysize 2048 -validity 10000
```

#### 5.2 配置签名

编辑 `android/gradle.properties`：

```properties
NIKANIKANI_UPLOAD_STORE_FILE=nikanikani-release.keystore
NIKANIKANI_UPLOAD_KEY_ALIAS=nikanikani
NIKANIKANI_UPLOAD_STORE_PASSWORD=your_password
NIKANIKANI_UPLOAD_KEY_PASSWORD=your_password
```

编辑 `android/app/build.gradle`，添加签名配置：

```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('NIKANIKANI_UPLOAD_STORE_FILE')) {
                storeFile file(NIKANIKANI_UPLOAD_STORE_FILE)
                storePassword NIKANIKANI_UPLOAD_STORE_PASSWORD
                keyAlias NIKANIKANI_UPLOAD_KEY_ALIAS
                keyPassword NIKANIKANI_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

---

## 在华为手机上安装 APK

### 方法 1：直接安装（需要允许未知来源）

1. 将 APK 文件传输到手机
2. 在手机上打开文件管理器，找到 APK 文件
3. 点击安装
4. 如果提示"允许安装未知应用"，前往设置 -> 安全 -> 允许安装未知应用
5. 完成安装

### 方法 2：通过 USB 传输

1. 使用 USB 数据线连接手机和电脑
2. 在手机上选择"文件传输"模式
3. 将 APK 文件复制到手机存储
4. 在手机上打开文件管理器，找到并安装 APK

### 方法 3：使用 ADB 安装（适合开发者）

1. 启用开发者选项：设置 -> 关于手机 -> 连续点击"版本号"
2. 启用 USB 调试：设置 -> 系统和更新 -> 开发者选项 -> USB 调试
3. 连接手机到电脑
4. 在电脑上执行：

```bash
adb install nikanikani.apk
```

---

## 华为 HarmonyOS 兼容性说明

✅ **兼容性：**
- HarmonyOS 4.2 基于 Android 13
- 完全支持 Android APK 格式
- 可以正常运行 Expo 构建的应用

⚠️ **注意事项：**
- 首次运行可能需要授予网络权限
- 如果应用无法连接后端，请检查网络权限
- 建议关闭"纯净模式"以允许安装未知应用

---

## 常见问题

### Q1: 安装时提示"应用未安装"

**解决方法：**
1. 卸载旧版本（如果有）
2. 检查 APK 文件是否完整
3. 确保有足够的存储空间

### Q2: 应用无法连接后端

**解决方法：**
1. 检查手机网络连接
2. 确保后端服务器正在运行
3. 检查防火墙设置

### Q3: 应用闪退

**解决方法：**
1. 查看应用日志（使用 adb logcat）
2. 检查 Android 版本兼容性（需要 Android 6.0+）
3. 尝试重新安装

### Q4: EAS Build 失败

**解决方法：**
1. 检查 Expo 账户余额
2. 查看构建日志定位问题
3. 确保 app.config.ts 配置正确

---

## 推荐流程（对于普通用户）

1. **使用方案 1（EAS Build）**
2. 注册 Expo 账户
3. 执行 `eas build --platform android --profile preview`
4. 下载生成的 APK
5. 通过 USB 传输到华为手机
6. 允许安装未知应用
7. 完成安装

---

## 联系支持

如果遇到问题，可以：
1. 查看 [Expo 官方文档](https://docs.expo.dev)
2. 在 GitHub 提交 issue
3. 联系开发者

---

## 应用信息

- **应用名称：** 你看看你
- **包名：** com.nikanikani.app
- **版本：** 1.0.0
- **最低 Android 版本：** 6.0 (API 23)
- **目标 Android 版本：** 14 (API 34)
