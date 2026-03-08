# 🚀 快速开始 - 在 Windows 电脑上构建 APK

**适合人群：** 有 Windows 电脑，想在华为手机上安装"你看看你"应用的用户

---

## 📌 三步构建流程

### 第 1 步：安装开发工具（约 20 分钟）

#### 1.1 安装 Node.js
- 下载：https://nodejs.org/
- 选择 **LTS 版本**
- 双击安装，一路点击 Next

**验证安装：**
```bash
node --version
npm --version
```

#### 1.2 安装 JDK 17
- 下载：https://adoptium.net/temurin/releases/?version=17
- 选择 **Windows x64**
- 双击安装，使用默认设置

**验证安装：**
```bash
java -version
```

#### 1.3 安装 Android Studio
- 下载：https://developer.android.com/studio
- 选择 **Windows (64-bit)**
- 双击安装，选择 "Standard" 安装类型
- 等待下载 Android SDK（15-30 分钟）

**验证安装：**
```bash
adb version
```

---

### 第 2 步：获取项目代码（约 5 分钟）

#### 2.1 创建项目文件夹
```bash
# 打开命令提示符（CMD）
cd D:\
mkdir nikanikani
cd nikanikani
```

#### 2.2 复制项目文件
- 将沙箱中的项目文件复制到 `D:\nikanikani\`
- 确保包含 `client` 和 `server` 文件夹

#### 2.3 安装依赖
```bash
cd D:\nikanikani
pnpm install
```

---

### 第 3 步：构建 APK（约 30 分钟）

#### 3.1 生成 Android 项目
```bash
cd client
npx expo prebuild --platform android
```

#### 3.2 构建 APK
```bash
cd android
.\gradlew.bat assembleDebug
```

#### 3.3 查找 APK
```
android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📱 安装到华为手机

### 方法 1：使用 ADB（推荐）

1. **启用 USB 调试：**
   - 设置 → 关于手机 → 连续点击 7 次"版本号"
   - 设置 → 系统和更新 → 开发者选项
   - 打开"USB 调试"和"USB 安装"

2. **连接手机：**
   - 用 USB 线连接手机和电脑
   - 在手机上选择"文件传输"模式

3. **安装 APK：**
```bash
adb install D:\nikanikani\client\android\app\build\outputs\apk\debug\app-debug.apk
```

### 方法 2：手动安装

1. 复制 APK 文件到手机
2. 在手机上打开文件管理器
3. 点击 APK 文件并安装

---

## ⏱️ 时间预估

| 步骤 | 时间 |
|------|------|
| 安装开发工具 | 20-40 分钟 |
| 获取项目代码 | 5-10 分钟 |
| 构建 APK | 20-40 分钟 |
| 安装到手机 | 2-5 分钟 |
| **总计** | **47-95 分钟** |

---

## ❓ 遇到问题？

查看详细文档：
- **📋 检查清单：** [INSTALL_CHECKLIST.md](./INSTALL_CHECKLIST.md)
- **📖 完整指南：** [LOCAL_BUILD_GUIDE.md](./LOCAL_BUILD_GUIDE.md)
- **🔧 常见问题：** [BUILD_APK_GUIDE.md](./BUILD_APK_GUIDE.md)

---

## 💡 提示

- ✅ 首次构建需要 20-40 分钟，请耐心等待
- ✅ 确保网络连接稳定
- ✅ 后续构建会快很多（依赖已缓存）
- ✅ 可以先去喝杯咖啡 ☕

---

**祝你构建顺利！** 🚀
