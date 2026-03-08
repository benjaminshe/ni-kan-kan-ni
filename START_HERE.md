# 🎯 从这里开始 - "你看看你" 应用构建指南

欢迎使用"你看看你"应用！这份文档将帮助你从零开始，在华为 HarmonyOS 手机上安装并运行应用。

---

## 📋 你的选择

请根据你的情况选择合适的构建方式：

### 🅰️ 我有 Windows 电脑，想自己构建

**推荐指数：** ⭐⭐⭐⭐⭐

**优点：**
- ✅ 完全控制构建过程
- ✅ 无构建次数限制
- ✅ 可以自由修改和定制

**缺点：**
- ❌ 需要安装开发工具（20-40 分钟）
- ❌ 首次构建需要时间（20-40 分钟）

**适合人群：**
- 有 Windows 电脑
- 想学习 Android 开发
- 需要频繁构建和修改

---

### 🅱️ 我想用云端构建（EAS Build）

**推荐指数：** ⭐⭐⭐⭐

**优点：**
- ✅ 无需本地环境
- ✅ 云端构建，简单快捷
- ✅ Expo 官方支持

**缺点：**
- ❌ 需要注册 Expo 账户
- ❌ 免费账户有构建次数限制

**适合人群：**
- 不想安装开发工具
- 只需要偶尔构建
- 希望快速体验

---

### 🆔 其他情况

如果你有其他需求，请告诉我：
- 只有 Mac 电脑？
- 想用在线构建服务（Codemagic、AppCenter）？
- 想用 Expo Go 快速体验？

---

## 🅰️ 路线 1：本地构建（Windows）

### 第 1 步：下载项目

📄 查看：[DOWNLOAD.md](./DOWNLOAD.md)

### 第 2 步：安装开发工具

📄 查看：[LOCAL_BUILD_GUIDE.md](./LOCAL_BUILD_GUIDE.md) 第 2 节

**需要安装：**
1. Node.js（30MB）
2. JDK 17（180MB）
3. Android Studio（1GB）

**时间：** 约 20-40 分钟

### 第 3 步：检查环境

📄 查看：[INSTALL_CHECKLIST.md](./INSTALL_CHECKLIST.md)

逐项检查确保所有工具正确安装。

### 第 4 步：构建 APK

📄 查看：[LOCAL_BUILD_GUIDE.md](./LOCAL_BUILD_GUIDE.md) 第 4 节

```bash
# 生成 Android 项目
cd D:\nikanikani\client
npx expo prebuild --platform android

# 构建 APK
cd android
.\gradlew.bat assembleDebug
```

**时间：** 约 20-40 分钟

### 第 5 步：安装到手机

📄 查看：[LOCAL_BUILD_GUIDE.md](./LOCAL_BUILD_GUIDE.md) 第 5 节

---

### 快速参考

| 文档 | 用途 |
|------|------|
| [QUICK_GUIDE.md](./QUICK_GUIDE.md) | 快速开始（3步） |
| [INSTALL_CHECKLIST.md](./INSTALL_CHECKLIST.md) | 环境检查清单 |
| [LOCAL_BUILD_GUIDE.md](./LOCAL_BUILD_GUIDE.md) | 详细构建指南 |
| [DOWNLOAD.md](./DOWNLOAD.md) | 下载项目文件 |

---

## 🅱️ 路线 2：云端构建（EAS Build）

### 第 1 步：注册 Expo 账户

访问：https://expo.dev

### 第 2 步：安装 EAS CLI

```bash
npm install -g eas-cli
```

### 第 3 步：登录

```bash
eas login
```

### 第 4 步：构建

```bash
cd client
eas build --platform android --profile preview
```

### 第 5 步：下载并安装

- 构建完成后会显示下载链接
- 下载 APK 并安装到手机

---

### 快速参考

| 文档 | 用途 |
|------|------|
| [QUICK_START.md](./QUICK_START.md) | EAS Build 快速开始 |
| [BUILD_APK_GUIDE.md](./BUILD_APK_GUIDE.md) | 完整构建指南 |

---

## 📱 构建成功后

安装 APK 到华为手机后：

### 1. 启用开发者选项

- 设置 → 关于手机 → 连续点击 7 次"版本号"

### 2. 启用 USB 调试

- 设置 → 系统和更新 → 开发者选项
- 打开"USB 调试"和"USB 安装"

### 3. 安装 APK

```bash
adb install app-debug.apk
```

或手动复制到手机并安装

### 4. 授予权限

- 首次运行时允许网络权限
- 如需要，关闭纯净模式

### 5. 开始使用

- **首页：** 查看今日概览
- **统计：** 查看数据分析
- **记录：** 添加内容记录
- **我的：** 管理数据

---

## ⏱️ 时间预估

### 本地构建

| 步骤 | 时间 |
|------|------|
| 下载项目 | 5 分钟 |
| 安装工具 | 20-40 分钟 |
| 检查环境 | 5 分钟 |
| 构建 APK | 20-40 分钟 |
| 安装到手机 | 5 分钟 |
| **总计** | **55-95 分钟** |

### 云端构建

| 步骤 | 时间 |
|------|------|
| 注册账户 | 2 分钟 |
| 安装 EAS CLI | 2 分钟 |
| 登录 | 1 分钟 |
| 构建 APK | 10-20 分钟 |
| 下载 APK | 2 分钟 |
| 安装到手机 | 5 分钟 |
| **总计** | **22-32 分钟** |

---

## 💡 提示

- ⏰ 首次构建需要耐心，请准备足够时间
- 🌐 确保网络连接稳定
- ☕ 可以准备一杯咖啡，等待构建完成
- 📝 遇到问题时，查看对应的文档
- 🆘 如果问题仍未解决，可以联系开发者

---

## 🎉 完成后

恭喜你！你已经成功：

✅ 在华为 HarmonyOS 手机上安装了"你看看你"应用
✅ 开始追踪你的手机使用情况
✅ 分析你的内容偏好

**下一步：**
1. 记录你的第一次内容
2. 查看今日使用概览
3. 探索各种统计功能
4. 分享给朋友

---

## 📚 文档导航

### 构建相关

- [START_HERE.md](./START_HERE.md) - 从这里开始（当前文档）
- [DOWNLOAD.md](./DOWNLOAD.md) - 下载项目文件
- [QUICK_GUIDE.md](./QUICK_GUIDE.md) - 快速开始
- [INSTALL_CHECKLIST.md](./INSTALL_CHECKLIST.md) - 环境检查清单
- [LOCAL_BUILD_GUIDE.md](./LOCAL_BUILD_GUIDE.md) - 本地构建详细指南
- [BUILD_APK_GUIDE.md](./BUILD_APK_GUIDE.md) - 构建指南
- [QUICK_START.md](./QUICK_START.md) - EAS Build 快速开始

### 项目相关

- [README.md](./README.md) - 项目说明

---

## 🆘 需要帮助？

1. **查看对应文档：** 根据你的问题查看相关文档
2. **检查环境：** 使用 [INSTALL_CHECKLIST.md](./INSTALL_CHECKLIST.md) 逐项检查
3. **搜索解决方案：** 在 Google 或 GitHub 搜索错误信息
4. **联系开发者：** 提供详细的错误信息

---

**祝你构建顺利！** 🚀

有问题随时问我！
