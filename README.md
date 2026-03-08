# 你看看你 - 手机使用分析应用

一个简单易用的手机使用统计和内容分析工具，帮助你了解自己的使用习惯和内容偏好。

**🎉 现已支持离线模式！所有数据存储在手机本地，无需联网即可使用。**

## 📱 应用简介

"你看看你" 是一个基于 Expo + React Native 开发的移动应用，提供以下功能：

### 核心功能

✅ **使用时长追踪** - 自动记录应用使用时间，统计每日/每周/每月使用时长
✅ **使用频次统计** - 记录打开次数，分析使用习惯
✅ **内容分类管理** - 5种预设分类（社交、娱乐、工作、学习、其他）
✅ **数据分析报表** - 今日概览、周/月趋势、内容偏好分布
✅ **离线存储** - 所有数据存储在本地，无需联网
✅ **数据导出** - 支持导出数据为 JSON 格式

### 页面结构

1. **首页** - 今日使用概览（使用时长、次数、平均时长）
2. **统计** - 详细的数据图表和分析（支持周/月切换）
3. **记录** - 手动添加内容分类记录
4. **我的** - 设备信息、数据导出和清除、关于信息

---

## 🚀 快速开始

### 在华为 HarmonyOS 手机上安装

#### 方案 1：本地构建（推荐）

如果你有 Windows 电脑，可以自己构建 APK：

1. **下载项目文件：** 查看 [DOWNLOAD.md](./DOWNLOAD.md)
2. **快速开始：** 阅读 [QUICK_GUIDE.md](./QUICK_GUIDE.md)
3. **环境检查：** 使用 [INSTALL_CHECKLIST.md](./INSTALL_CHECKLIST.md)
4. **详细构建：** 参考 [LOCAL_BUILD_GUIDE.md](./LOCAL_BUILD_GUIDE.md)

#### 方案 2：EAS Build 云端构建

使用 Expo 官方云端构建服务：

- **新手快速入门：** [QUICK_START.md](./QUICK_START.md)
- **完整构建指南：** [BUILD_APK_GUIDE.md](./BUILD_APK_GUIDE.md)

### 快速构建步骤（本地）

```bash
# 1. 进入项目目录
cd D:\nikanikani

# 2. 安装依赖
pnpm install

# 3. 生成 Android 项目
cd client
npx expo prebuild --platform android

# 4. 构建 APK
cd android
.\gradlew.bat assembleDebug

# 5. 安装到手机
adb install app\build\outputs\apk\debug\app-debug.apk
```

### 快速构建步骤（EAS Build）

```bash
# 1. 安装 EAS CLI
npm install -g eas-cli

# 2. 登录 Expo（需要先在 https://expo.dev 注册）
eas login

# 3. 进入项目目录
cd client

# 4. 构建 APK
eas build --platform android --profile preview

# 5. 下载并在手机上安装 APK
```

---

## 📦 目录结构

```
├── server/                     # 后端服务 (Express.js) - 离线模式不需要
│   ├── src/
│   │   ├── routes/            # API 路由
│   │   ├── storage/
│   │   │   └── database/      # 数据库配置（Supabase）
│   │   └── index.ts           # Express 入口文件
│   └── package.json
│
├── client/                     # 前端应用 (Expo + React Native)
│   ├── app/                    # Expo Router 路由
│   │   ├── (tabs)/            # Tab 导航页面
│   │   │   ├── index.tsx      # 首页
│   │   │   ├── stats.tsx      # 统计页
│   │   │   ├── record.tsx     # 记录页
│   │   │   ├── profile.tsx    # 我的页
│   │   │   └── _layout.tsx    # Tab 布局
│   │   └── _layout.tsx        # 根布局
│   ├── screens/               # 页面实现
│   │   ├── home/              # 首页组件
│   │   ├── stats/             # 统计页组件
│   │   ├── record/            # 记录页组件
│   │   └── profile/           # 我的页组件
│   ├── services/              # 数据服务（离线存储）
│   │   └── storage.ts         # AsyncStorage 封装
│   ├── components/            # 可复用组件
│   ├── hooks/                 # 自定义 Hooks
│   ├── contexts/              # React Context
│   ├── constants/             # 常量定义（主题等）
│   ├── utils/                 # 工具函数
│   ├── assets/                # 静态资源
│   ├── eas.json               # EAS Build 配置
│   └── package.json
│
├── BUILD_APK_GUIDE.md         # APK 构建完整指南
├── QUICK_START.md             # 快速开始指南
├── 离线模式使用指南.md         # 离线模式使用说明
├── build.sh                   # 构建脚本
└── README.md                  # 本文件
```

---

## 🔧 技术栈

### 前端
- **Expo 54** - React Native 开发框架
- **React Native** - 跨平台 UI 框架
- **Expo Router** - 文件系统路由
- **TypeScript** - 类型安全
- **@react-native-async-storage/async-storage** - 本地存储

### 数据存储
- **AsyncStorage** - 本地数据存储
- 无需后端服务
- 支持数据导出

---

## 📱 设备兼容性

### 支持的设备和系统

✅ **华为 HarmonyOS 4.2.136** - 完全兼容（基于 Android 13）
✅ **Android 6.0+** - 所有 Android 设备
✅ **iOS 13+** - 所有 iOS 设备
✅ **Web 浏览器** - Chrome、Safari、Edge

### 系统要求

- **存储空间：** 至少 50MB
- **网络：** 不需要（离线模式）
- **权限：** 无需特殊权限

---

## 🎯 离线模式说明

### 数据存储

- 所有数据存储在手机的 **AsyncStorage** 中
- 数据包括：
  - 使用会话记录
  - 内容记录
  - 分类信息

### 数据安全

- 数据存储在本地，不会上传到服务器
- 可以随时导出数据备份
- 清除数据会删除所有记录，请谨慎操作

### 使用提示

1. **首次使用**：APP 会自动创建默认分类（社交、娱乐、工作、学习、其他）

2. **使用时长**：
   - 打开 APP 后自动开始计时
   - 切换到其他应用或锁屏时自动停止计时
   - 重新打开 APP 后继续计时

3. **记录内容**：
   - 点击右下角的 `+` 按钮添加记录
   - 选择分类、输入标题（必填）、备注（可选）
   - 点击保存完成记录

4. **查看统计**：
   - 切换到"统计"页面查看数据
   - 点击"本周"或"本月"切换时间范围

5. **导出数据**：
   - 切换到"我的"页面
   - 点击"导出数据"
   - 复制 JSON 数据到剪贴板

6. **清除数据**：
   - 切换到"我的"页面
   - 点击"清除数据"
   - 确认后删除所有记录（不可恢复）

详细使用说明请查看 [离线模式使用指南.md](./离线模式使用指南.md)

---

## 🛠️ 本地开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
coze dev
```

这会同时启动：
- **前端服务**：http://localhost:5000

### 前端开发

```bash
cd client
npx expo start
```

---

## 📄 许可证

本项目仅供个人学习和使用。

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📞 联系方式

如有问题或建议，请联系开发者。

---

## 📝 更新日志

### v1.0.0 (2025-03-08)
- ✨ 新增离线模式，无需后端服务
- ✨ 支持本地数据存储
- ✨ 支持数据导出功能
- 🐛 修复已知问题
- 📚 完善文档
