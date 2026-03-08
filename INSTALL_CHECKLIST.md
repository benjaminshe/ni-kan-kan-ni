# ✅ 本地构建环境检查清单

在开始构建之前，请逐项检查以下内容。

## 📋 电脑配置检查

### 系统要求

- [ ] **操作系统：** Windows 10 或 Windows 11
- [ ] **内存：** 至少 8GB（推荐 16GB）
- [ ] **磁盘空间：** 至少 10GB 可用空间
- [ ] **网络：** 稳定的网络连接

### 确认方法
1. 右键点击"此电脑" → "属性"
2. 查看"设备规格"中的信息

---

## 🔧 开发工具检查

### 1. Node.js

- [ ] 已安装 Node.js（推荐版本：20.x LTS）
- [ ] 可以在命令提示符中运行 `node --version`
- [ ] 可以运行 `npm --version`

**验证方法：**
```bash
# 打开命令提示符（CMD）或 PowerShell
node --version
npm --version
```

**下载地址：** https://nodejs.org/

---

### 2. JDK（Java Development Kit）

- [ ] 已安装 JDK 17
- [ ] 可以运行 `java -version` 显示 openjdk 17.x.x
- [ ] 已配置 JAVA_HOME 环境变量（如果需要）

**验证方法：**
```bash
java -version
```

**下载地址：** https://adoptium.net/temurin/releases/?version=17

**配置环境变量（如果命令无法识别）：**
```bash
# 右键"此电脑" → 属性 → 高级系统设置 → 环境变量
# 系统变量 → 新建
# 变量名：JAVA_HOME
# 变量值：C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot
```

---

### 3. Android Studio

- [ ] 已安装 Android Studio
- [ ] 已完成首次启动配置
- [ ] 已下载 Android SDK（API 33/34）
- [ ] 已安装 Android SDK Build-Tools 34.0.0
- [ ] 已配置 ANDROID_HOME 环境变量
- [ ] 可以运行 `adb version`

**验证方法：**
```bash
# 关闭并重新打开命令提示符
adb version
```

**下载地址：** https://developer.android.com/studio

**配置环境变量（如果 adb 命令无法识别）：**
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

---

## 📁 项目文件检查

### 4. 项目代码

- [ ] 已获取项目代码（client 和 server 文件夹）
- [ ] 项目文件夹位于 `D:\nikanikani\`
- [ ] 包含 `client/package.json` 文件
- [ ] 包含 `server/package.json` 文件

**验证方法：**
```bash
cd D:\nikanikani
dir
```

应该看到：
```
client/
server/
package.json
README.md
其他文件...
```

---

### 5. 依赖安装

- [ ] 已安装 pnpm（`npm install -g pnpm`）
- [ ] 已运行 `pnpm install` 安装依赖
- [ ] 依赖安装完成无错误

**验证方法：**
```bash
cd D:\nikanikani
pnpm install
```

---

## 📱 手机准备检查

### 6. 华为手机配置

- [ ] 手机型号：华为（HarmonyOS 4.2.136）
- [ ] 已启用开发者选项
- [ ] 已启用 USB 调试
- [ ] 已启用 USB 安装（允许安装未知应用）
- [ ] 存储空间至少 50MB
- [ ] 网络连接正常

**启用开发者选项：**
1. 设置 → 关于手机
2. 连续点击 7 次"版本号"
3. 提示"您已处于开发者模式"

**启用 USB 调试：**
1. 设置 → 系统和更新 → 开发者选项
2. 打开"USB 调试"开关
3. 打开"USB 安装"开关

---

## 🚀 构建前最终检查

### 7. 环境验证

在命令提示符中依次运行以下命令，确保都能正常输出：

```bash
# 1. Node.js
node --version
npm --version

# 2. Java
java -version

# 3. Android SDK
adb version

# 4. 进入项目目录
cd D:\nikanikani

# 5. 检查项目文件
dir

# 6. 进入 client 目录
cd client

# 7. 生成 Android 项目（首次需要）
npx expo prebuild --platform android

# 8. 进入 android 目录
cd android

# 9. 构建 APK
.\gradlew.bat assembleDebug
```

---

## ⚠️ 常见问题

### 问题 1：命令无法识别

**可能原因：**
- 工具未安装
- 环境变量未配置
- 需要重启命令提示符

**解决方法：**
1. 重新安装工具
2. 配置环境变量
3. 关闭并重新打开命令提示符

### 问题 2：权限不足

**可能原因：**
- 未以管理员身份运行

**解决方法：**
- 右键点击命令提示符 → "以管理员身份运行"

### 问题 3：网络问题

**可能原因：**
- 网络连接不稳定
- 防火墙拦截

**解决方法：**
- 使用稳定的 Wi-Fi
- 临时关闭防火墙
- 配置镜像源（见构建指南）

---

## 📊 检查清单完成情况

| 检查项 | 状态 |
|--------|------|
| 电脑配置 | ☐ 未完成 / ☑ 已完成 |
| Node.js | ☐ 未完成 / ☑ 已完成 |
| JDK 17 | ☐ 未完成 / ☑ 已完成 |
| Android Studio | ☐ 未完成 / ☑ 已完成 |
| 项目代码 | ☐ 未完成 / ☑ 已完成 |
| 依赖安装 | ☐ 未完成 / ☑ 已完成 |
| 手机配置 | ☐ 未完成 / ☑ 已完成 |
| 环境验证 | ☐ 未完成 / ☑ 已完成 |

---

## 🎯 全部完成后

当所有检查项都标记为 ☑ 已完成后：

1. **关闭并重新打开命令提示符**
2. **运行以下命令开始构建：**

```bash
cd D:\nikanikani\client
npx expo prebuild --platform android
cd android
.\gradlew.bat assembleDebug
```

3. **等待构建完成**（首次 20-40 分钟）

4. **安装到手机：**

```bash
adb install app\build\outputs\apk\debug\app-debug.apk
```

---

## 💡 提示

- ⏰ 首次构建需要 20-40 分钟，请耐心等待
- 🌐 确保网络连接稳定
- ☕ 可以准备一杯咖啡，等待构建完成
- 📝 如果遇到问题，查看 [LOCAL_BUILD_GUIDE.md](./LOCAL_BUILD_GUIDE.md) 的常见问题部分

---

**祝你构建顺利！** 🚀
