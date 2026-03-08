# 📱 在 Windows 电脑上构建 APK 并安装到华为手机

本指南将一步步教你如何在 Windows 电脑上构建"你看看你"应用的 APK，并安装到华为 HarmonyOS 4.2.136 手机上。

---

## 📋 目录

1. [准备工作](#1-准备工作)
2. [安装开发工具](#2-安装开发工具)
3. [获取项目代码](#3-获取项目代码)
4. [构建 APK](#4-构建-apk)
5. [安装到华为手机](#5-安装到华为手机)
6. [常见问题](#6-常见问题)

---

## 1. 准备工作

### 1.1 确认你的电脑配置

**最低要求：**
- ✅ Windows 10 或 Windows 11
- ✅ 至少 8GB 内存（建议 16GB）
- ✅ 至少 10GB 可用磁盘空间
- ✅ 稳定的网络连接

### 1.2 准备安装文件

下载以下文件（免费）：

1. **Node.js** - JavaScript 运行环境
   - 下载地址：https://nodejs.org/
   - 选择 **LTS 版本**（推荐：Node.js 20.x）
   - 文件大小：约 30MB

2. **JDK 17** - Java 开发工具包
   - 下载地址：https://adoptium.net/temurin/releases/?version=17
   - 选择 **Windows x64** 版本
   - 文件大小：约 180MB

3. **Android Studio** - Android 开发工具（包含 Android SDK）
   - 下载地址：https://developer.android.com/studio
   - 选择 **Windows (64-bit)**
   - 文件大小：约 1GB

---

## 2. 安装开发工具

### 2.1 安装 Node.js

1. **双击下载的 Node.js 安装包**
2. **点击 "Next"** 接受许可协议
3. **选择安装路径**（建议使用默认路径）
4. **确保勾选 "Automatically install the necessary tools..."**
5. **点击 "Next"** → 点击 "Install"
6. **等待安装完成** → 点击 "Finish"

**验证安装：**
```bash
# 打开命令提示符（CMD）或 PowerShell
node --version
npm --version
```
如果显示版本号，说明安装成功。

---

### 2.2 安装 JDK 17

1. **双击下载的 JDK 安装包**
2. **点击 "Next"** 接受许可协议
3. **选择安装路径**（建议使用默认路径：`C:\Program Files\Eclipse Adoptium\jdk-17.0.11.9-hotspot`）
4. **点击 "Next"** → 等待安装完成
5. **点击 "Close"**

**验证安装：**
```bash
java -version
```
应该显示 `openjdk version "17.x.x"`

**配置环境变量（如果需要）：**
```bash
# 右键"此电脑" → 属性 → 高级系统设置 → 环境变量
# 系统变量 → 新建
# 变量名：JAVA_HOME
# 变量值：C:\Program Files\Eclipse Adoptium\jdk-17.0.11.9-hotspot
```

---

### 2.3 安装 Android Studio

1. **双击下载的 Android Studio 安装包**
2. **点击 "Next"** → 选择安装组件（全选）
3. **选择安装路径**（建议使用默认路径）
4. **点击 "Next"** → 点击 "Install"
5. **等待安装完成**（可能需要 5-10 分钟）

**首次启动配置：**

1. **启动 Android Studio**
2. **选择 "Standard" 安装类型** → 点击 "Next"
3. **点击 "Next"** 接受许可协议
4. **点击 "Finish"** 开始下载 Android SDK（可能需要 15-30 分钟）
5. **等待下载完成** → 点击 "Finish"

**安装必需的 SDK 组件：**

1. 在 Android Studio 中，点击 **Tools** → **SDK Manager**
2. 在 **SDK Platforms** 标签中，确保勾选：
   - ✅ Android 14.0 (API 34)
   - ✅ Android 13.0 (API 33)
3. 在 **SDK Tools** 标签中，确保勾选：
   - ✅ Android SDK Build-Tools 34.0.0
   - ✅ Android SDK Platform-Tools
   - ✅ Android SDK Build-Tools
4. 点击 **Apply** → **OK** 开始安装

**配置环境变量：**

```bash
# 右键"此电脑" → 属性 → 高级系统设置 → 环境变量
# 系统变量 → 新建
# 变量名：ANDROID_HOME
# 变量值：C:\Users\你的用户名\AppData\Local\Android\Sdk

# 编辑 Path 变量，添加：
# %ANDROID_HOME%\platform-tools
# %ANDROID_HOME%\tools
# %ANDROID_HOME%\tools\bin
```

**验证安装：**
```bash
# 关闭并重新打开命令提示符
adb version
```
如果显示版本号，说明配置成功。

---

## 3. 获取项目代码

### 3.1 安装 Git（如果没有）

1. 下载地址：https://git-scm.com/download/win
2. 双击安装包，一路点击 "Next" 使用默认设置
3. 安装完成后，打开命令提示符验证：
```bash
git --version
```

### 3.2 创建项目文件夹

1. **在 D 盘创建项目文件夹：**
   ```bash
   cd D:\
   mkdir nikanikani
   cd nikanikani
   ```

2. **获取项目代码（方式 1：下载压缩包）**

   - 将沙箱中的项目文件复制到 `D:\nikanikani\` 文件夹
   - 确保包含 `client` 和 `server` 两个文件夹

3. **获取项目代码（方式 2：从 GitHub 克隆）**

   如果项目已上传到 GitHub：
   ```bash
   cd D:\nikanikani
   git clone https://github.com/你的用户名/项目名.git
   cd 项目名
   ```

---

## 4. 构建 APK

### 4.1 安装项目依赖

1. **打开命令提示符（CMD）**

2. **进入项目根目录：**
   ```bash
   cd D:\nikanikani
   ```

3. **安装全局依赖（如果需要）：**
   ```bash
   npm install -g pnpm
   ```

4. **安装项目依赖：**
   ```bash
   pnpm install
   ```

   这将安装前端和后端的所有依赖包，可能需要 5-10 分钟。

---

### 4.2 生成 Android 原生项目

1. **进入 client 目录：**
   ```bash
   cd client
   ```

2. **生成 Android 项目：**
   ```bash
   npx expo prebuild --platform android
   ```

   这将创建 `android` 文件夹，包含所有 Android 原生代码。

   **注意：**
   - 首次运行可能需要 2-5 分钟
   - 可能会提示安装一些工具，输入 `y` 确认

---

### 4.3 构建 APK

#### 方案 1：构建调试版 APK（推荐新手）

1. **进入 android 目录：**
   ```bash
   cd android
   ```

2. **构建调试版 APK：**
   ```bash
   .\gradlew.bat assembleDebug
   ```

   **注意：**
   - Windows 使用 `.\gradlew.bat`，Mac/Linux 使用 `./gradlew`
   - 首次构建可能需要下载 Gradle 依赖，需要 10-20 分钟
   - 如果遇到网络问题，可以配置 Gradle 镜像源

3. **查找 APK 文件：**
   ```
   android\app\build\outputs\apk\debug\app-debug.apk
   ```

#### 方案 2：构建发布版 APK（需要签名）

1. **生成签名密钥：**
   ```bash
   keytool -genkeypair -v -keystore nikanikani-release.keystore -alias nikanikani -keyalg RSA -keysize 2048 -validity 10000
   ```

   按提示输入：
   - **密钥库密码：** 设置一个强密码（记下来！）
   - **密钥密码：** 设置一个强密码（记下来！）
   - **其他信息：** 可以直接回车使用默认值

2. **配置签名（编辑 `android/gradle.properties`）：**
   ```properties
   NIKANIKANI_UPLOAD_STORE_FILE=nikanikani-release.keystore
   NIKANIKANI_UPLOAD_KEY_ALIAS=nikanikani
   NIKANIKANI_UPLOAD_STORE_PASSWORD=你的密钥库密码
   NIKANIKANI_UPLOAD_KEY_PASSWORD=你的密钥密码
   ```

3. **构建发布版 APK：**
   ```bash
   .\gradlew.bat assembleRelease
   ```

4. **查找 APK 文件：**
   ```
   android\app\build\outputs\apk\release\app-release.apk
   ```

---

### 4.4 解决构建问题

#### 问题 1：Gradle 下载失败

**解决方法：配置 Gradle 镜像源**

编辑 `android\build.gradle`，添加：
```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
        // 添加阿里云镜像
        maven { url 'https://maven.aliyun.com/repository/google' }
        maven { url 'https://maven.aliyun.com/repository/central' }
    }
}
```

#### 问题 2：依赖下载失败

**解决方法：配置 npm 镜像源**
```bash
npm config set registry https://registry.npmmirror.com
```

然后重新安装依赖：
```bash
cd D:\nikanikani
rm -rf node_modules
pnpm install
```

#### 问题 3：Android SDK 路径错误

**解决方法：**
编辑 `android/local.properties`，添加：
```properties
sdk.dir=C\:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
```

---

## 5. 安装到华为手机

### 5.1 准备手机

1. **启用开发者选项：**
   - 打开 **设置** → **关于手机**
   - 连续点击 7 次 **"版本号"**
   - 提示"您已处于开发者模式"

2. **启用 USB 调试：**
   - 打开 **设置** → **系统和更新** → **开发者选项**
   - 打开 **"USB 调试"** 开关
   - 打开 **"USB 安装"** 开关（允许安装未知应用）

3. **连接电脑：**
   - 用 USB 数据线连接手机和电脑
   - 在手机上选择 **"文件传输"** 或 **"传输文件"** 模式

---

### 5.2 安装 APK

#### 方法 1：使用 ADB 安装（推荐）

1. **验证连接：**
   ```bash
   adb devices
   ```
   应该显示你的设备序列号。

2. **安装 APK：**
   ```bash
   adb install android\app\build\outputs\apk\debug\app-debug.apk
   ```

3. **安装成功后，在手机上打开应用**

#### 方法 2：手动传输安装

1. **复制 APK 到手机：**
   - 将 `app-debug.apk` 复制到手机的 **"下载"** 文件夹
   - 或通过微信/QQ 发送到手机

2. **在手机上安装：**
   - 打开 **文件管理器**
   - 找到 **"下载"** 文件夹
   - 点击 **`app-debug.apk`** 文件
   - 点击 **"安装"**
   - 如果提示"允许安装未知应用"，点击 **"前往设置"** 并允许

3. **安装完成**

---

### 5.3 首次运行配置

1. **授予网络权限：**
   - 打开"你看看你"应用
   - 允许网络访问权限

2. **关闭纯净模式（如果提示）：**
   - 设置 → 系统和更新 → 纯净模式
   - 选择"退出"

3. **开始使用：**
   - 首页查看今日概览
   - 记录页添加内容
   - 统计页查看分析

---

## 6. 常见问题

### ❓ Q1: Node.js 安装失败

**解决方法：**
- 检查是否有杀毒软件拦截
- 以管理员身份运行安装程序
- 尝试下载最新版本

### ❓ Q2: Gradle 构建超时

**解决方法：**
- 配置 Gradle 镜像源（见上文）
- 检查网络连接
- 使用加速器（VPN）

### ❓ Q3: APK 安装失败

**可能原因：**
- 存储空间不足
- 旧版本未卸载
- 文件损坏

**解决方法：**
- 删除手机中一些文件
- 卸载旧版本
- 重新构建 APK

### ❓ Q4: 应用无法连接服务器

**解决方法：**
- 检查手机网络连接
- 确保后端服务正在运行
- 检查防火墙设置

### ❓ Q5: 构建时间太长

**说明：**
- 首次构建通常需要 20-30 分钟（正常）
- 后续构建会快很多（缓存依赖）
- 可以先去喝杯咖啡 ☕

---

## 📊 构建时间预估

| 步骤 | 首次构建 | 后续构建 |
|------|----------|----------|
| 安装依赖 | 5-10 分钟 | 1-2 分钟 |
| 生成 Android 项目 | 2-5 分钟 | 2-5 分钟 |
| 下载 Gradle | 10-15 分钟 | 跳过 |
| 构建 APK | 5-10 分钟 | 3-5 分钟 |
| **总计** | **22-40 分钟** | **6-12 分钟** |

---

## 🎉 完成后

恭喜你！你已经成功：

✅ 在 Windows 电脑上构建了 APK
✅ 安装到华为 HarmonyOS 手机
✅ 可以开始使用"你看看你"应用

---

## 📚 下一步

1. **开始使用应用：** 记录你的内容和使用时长
2. **查看数据分析：** 了解你的使用习惯
3. **分享给朋友：** 让他们也试试
4. **反馈建议：** 告诉我使用体验

---

## 💡 提示

- **首次构建需要耐心**，正常需要 20-40 分钟
- **网络要好**，建议使用稳定的 Wi-Fi
- **遇到问题不要慌**，查看常见问题部分
- **成功后可以保存配置**，后续构建会快很多

---

## 🆘 需要帮助？

如果遇到问题：

1. **查看本文档的常见问题部分**
2. **查看错误日志：** `android/app/build/reports/`
3. **搜索解决方案：** Google 或 GitHub Issues
4. **联系开发者：** 提供错误信息

---

**祝你构建顺利！** 🚀
