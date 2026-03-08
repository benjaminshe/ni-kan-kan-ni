# GitHub Actions Android APK 构建指南

> 完整的 GitHub Actions 构建指南，适用于 Expo + React Native + Express 项目
>
> 创建时间：2026-03-08
>
> 用途：快速构建 Android APK，无需本地配置环境

---

## 📋 目录

1. [准备工作](#准备工作)
2. [创建 GitHub 仓库](#创建-github-仓库)
3. [配置 GitHub Actions](#配置-github-actions)
4. [推送代码](#推送代码)
5. [触发构建](#触发构建)
6. [下载 APK](#下载-apk)
7. [常见错误和解决方法](#常见错误和解决方法)
8. [完整模板](#完整模板)

---

## 准备工作

### 1. 注册 GitHub 账户

- 访问：https://github.com
- 点击 "Sign up" 注册
- 如果已有账户，直接登录

### 2. 安装 Git（如果还没有）

- 下载地址：https://git-scm.com/downloads
- 下载 Windows 版本
- 双击安装，一路点击"下一步"

### 3. 安装 Node.js（如果还没有）

- 下载地址：https://nodejs.org/
- 下载 LTS 版本（推荐 20.x）
- 双击安装，一路点击"下一步"

---

## 创建 GitHub 仓库

### 步骤 1：创建新仓库

1. 登录 GitHub
2. 点击右上角 "+" → "New repository"
3. 填写仓库信息：
   - Repository name: 你的项目名称
   - Description: 项目描述
   - Public/Private: 随意选择
4. 点击 "Create repository"
5. **复制仓库地址**，格式类似：`https://github.com/你的用户名/项目名.git`

---

## 配置 GitHub Actions

### 步骤 1：创建配置文件

1. 在项目根目录创建文件夹：`.github\workflows\`
2. 在 `workflows` 文件夹内创建文件：`build.yml`

**注意：** `.github` 前面有个点！

### 步骤 2：编辑 build.yml

**右键编辑 `build.yml`，粘贴完整内容：**

```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Cache Gradle packages
        uses: actions/cache@v3
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        working-directory: ./
        run: pnpm install

      - name: Prebuild Android
        working-directory: ./client
        run: npx expo prebuild --platform android

      - name: Grant execute permission for gradlew
        working-directory: ./client/android
        run: chmod +x gradlew

      - name: Build APK
        working-directory: ./client/android
        run: ./gradlew assembleDebug --no-daemon

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: client/android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 7
```

### 步骤 3：保存文件

**按 Ctrl + S 保存，关闭记事本**

---

## 推送代码

### 步骤 1：打开命令提示符

**按 Win + R，输入 `cmd`，回车**

### 步骤 2：进入项目目录

```
cd 你的项目路径
```

**示例：**
```
cd D:\phone\pack_project
```

### 步骤 3：初始化 Git（如果还没有）

```
git init
```

### 步骤 4：配置用户信息（首次使用需要）

```
git config user.name "你的名字"
git config user.email "你的邮箱"
```

**示例：**
```
git config user.name "zhangsan"
git config user.email "zhangsan@example.com"
```

### 步骤 5：添加所有文件

```
git add .
```

### 步骤 6：提交

```
git commit -m "Initial commit"
```

### 步骤 7：连接到 GitHub 仓库

```
git remote add origin https://github.com/你的用户名/你的项目名.git
```

**示例：**
```
git remote add origin https://github.com/zhangsan/myproject.git
```

### 步骤 8：推送代码

```
git branch -M main
git push -u origin main
```

**如果需要输入用户名和密码：**
- Username: 你的 GitHub 用户名
- Password: 你的 GitHub 密码

**如果密码登录失败，需要使用 Personal Access Token：**
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选 "repo" 权限
4. 点击 "Generate token"
5. 复制生成的 token
6. 在命令提示符中粘贴 token 作为密码

### 步骤 9：如果推送失败

**如果提示冲突，使用强制推送：**
```
git push --force -u origin main
```

---

## 触发构建

### 方法 1：自动触发

**推送代码后，构建会自动触发**

### 方法 2：手动触发

1. 访问你的 GitHub 仓库
2. 点击 "Actions" 标签
3. 点击 "Build Android APK" workflow
4. 点击右侧的 "Run workflow" 按钮
5. 选择分支（main）
6. 点击 "Run workflow"

---

## 查看构建进度

1. 在 "Actions" 页面，点击正在运行的构建
2. 查看各个步骤的执行情况
3. 等待所有步骤完成（10-20 分钟）
4. 构建成功后，所有步骤都会显示 ✅ 绿色对勾

---

## 下载 APK

1. 在构建成功页面，滚动到底部
2. 找到 "Artifacts" 部分
3. 点击 "app-debug" 右侧的下载图标
4. 保存文件
5. 解压缩
6. 得到 `app-debug.apk` 文件

---

## 常见错误和解决方法

### 错误 1：`actions/upload-artifact` 已弃用

**错误信息：**
```
This request has been automatically failed because it uses a deprecated version of `actions/upload-artifact: v3`
```

**解决方法：**
在 `build.yml` 中，把 `actions/upload-artifact@v3` 改成 `actions/upload-artifact@v4`

---

### 错误 2：Process completed with exit code 127

**错误信息：**
```
Process completed with exit code 127
```

**原因：** pnpm 未安装

**解决方法：**
在 `build.yml` 中，在 "Install dependencies" 之前添加：
```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 9
```

---

### 错误 3：pnpm 版本不匹配

**错误信息：**
```
ERR_PNPM_UNSUPPORTED_ENGINE Unsupported environment (bad pnpm and/or Node.js version)
Expected version: >=9.0.0
Got: 8.15.9
```

**解决方法：**
在 `build.yml` 中，把 `version: 8` 改成 `version: 9`

---

### 错误 4：Permission denied

**错误信息：**
```
/home/runner/work/_temp/xxx.sh: line 1: ./gradlew: Permission denied
Error: Process completed with exit code 126.
```

**解决方法：**
在 `build.yml` 中，在 "Build APK" 之前添加：
```yaml
- name: Grant execute permission for gradlew
  working-directory: ./client/android
  run: chmod +x gradlew
```

---

### 错误 5：推送时提示冲突

**错误信息：**
```
error: failed to push some refs to '...'
hint: Updates were rejected because the remote contains work that you do not have locally.
```

**解决方法：**
使用强制推送：
```
git push --force -u origin main
```

---

### 错误 6：git 命令不识别

**错误信息：**
```
'git' is not recognized as an internal or external command
```

**解决方法：**
安装 Git：
https://git-scm.com/downloads

---

## 完整模板

### 快速开始模板

**如果你想快速开始，直接复制以下内容到 `build.yml`：**

```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Cache Gradle packages
        uses: actions/cache@v3
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: |
            ${{ runner.os }}-gradle-

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        working-directory: ./
        run: pnpm install

      - name: Prebuild Android
        working-directory: ./client
        run: npx expo prebuild --platform android

      - name: Grant execute permission for gradlew
        working-directory: ./client/android
        run: chmod +x gradlew

      - name: Build APK
        working-directory: ./client/android
        run: ./gradlew assembleDebug --no-daemon

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-debug
          path: client/android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 7
```

---

## 重要提示

### 版本要求

- Node.js: 20.x
- Java: 17
- pnpm: >= 9.0.0
- Gradle: 自动下载

### 构建时间

- 首次构建：15-25 分钟
- 后续构建：10-15 分钟（使用缓存）

### APK 保留时间

- GitHub Actions 会保留 APK 7 天
- 7 天后自动删除

### 免费额度

- GitHub Actions 完全免费
- 每个月有 2000 分钟免费额度
- 对于个人项目完全够用

---

## 高级技巧

### 1. 自动删除旧构建产物

在 "Upload APK" 步骤之前添加：
```yaml
- name: Delete old artifacts
  uses: geekyeggo/delete-artifact@v2
  with:
    name: app-debug
    failOnError: false
```

### 2. 构建多个版本

如果你需要构建 debug 和 release 版本：

```yaml
- name: Build Debug APK
  working-directory: ./client/android
  run: ./gradlew assembleDebug --no-daemon

- name: Build Release APK
  working-directory: ./client/android
  run: ./gradlew assembleRelease --no-daemon

- name: Upload Debug APK
  uses: actions/upload-artifact@v4
  with:
    name: app-debug
    path: client/android/app/build/outputs/apk/debug/app-debug.apk
    retention-days: 7

- name: Upload Release APK
  uses: actions/upload-artifact@v4
  with:
    name: app-release
    path: client/android/app/build/outputs/apk/release/app-release.apk
    retention-days: 30
```

### 3. 发送构建通知

构建完成后发送邮件通知：

```yaml
- name: Send email notification
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.example.com
    server_port: 587
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Build completed
    body: |
      Build completed successfully!
      Repository: ${{ github.repository }}
      Commit: ${{ github.sha }}
    to: your-email@example.com
    from: noreply@example.com
```

---

## 常见问题

### Q1: 构建失败怎么办？

**A:**
1. 查看构建日志，找到失败的步骤
2. 查看错误信息
3. 参考本文档的"常见错误和解决方法"部分
4. 修复后重新推送代码

### Q2: 如何加速构建？

**A:**
- 使用 Gradle 缓存（已包含在模板中）
- 使用依赖缓存（已包含在模板中）
- 减少不必要的步骤

### Q3: APK 文件太大怎么办？

**A:**
- 开启混淆和压缩
- 移除不必要的资源
- 使用 App Bundle（aab）替代 APK

### Q4: 如何构建签名版 APK？

**A:**
1. 生成签名密钥
2. 在 GitHub Secrets 中存储密钥信息
3. 在 `build.yml` 中配置签名

---

## 总结

### 快速开始

```
1. 创建 GitHub 仓库
2. 创建 .github/workflows/build.yml
3. 粘贴完整模板
4. 初始化 Git：git init
5. 添加文件：git add .
6. 提交：git commit -m "Initial commit"
7. 推送：git push -u origin main
8. 触发构建
9. 下载 APK
```

### 关键点

- ✅ 使用 `actions/upload-artifact@v4`
- ✅ 安装 pnpm（version 9）
- ✅ 给 gradlew 添加执行权限
- ✅ 使用 GitHub Actions 免费构建
- ✅ 无需本地配置环境

---

## 联系和更新

**文档创建时间：** 2026-03-08

**最后更新时间：** 2026-03-08

**适用于：** Expo + React Native + Express 项目

**版本：** 1.0

---

**祝你构建成功！** 🎉
