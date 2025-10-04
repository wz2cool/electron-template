# 自动更新功能使用指南

本应用已集成 `electron-updater` 自动更新功能，与 `electron-builder` 完全兼容。

## 功能特性

### 1. 自动更新检查
- 应用启动后3秒自动检查更新
- 仅在生产环境中执行自动检查
- 支持手动检查更新

### 2. 更新通知
- 发现新版本时显示更新对话框
- 显示版本信息、发布日期和更新日志
- 支持稍后提醒或立即下载

### 3. 下载进度
- 实时显示下载进度条
- 显示下载速度和已下载大小
- 支持后台下载

### 4. 自动安装
- 下载完成后提示用户安装
- 支持一键重启安装
- 安装过程无需用户干预

## 使用方法

### 基本设置

1. **配置发布源**
   在 `package.json` 中已配置 GitHub 作为发布源：
   ```json
   "publish": {
     "provider": "github",
     "owner": "wz2cool",
     "repo": "ourui-tool-v4"
   }
   ```

2. **自动更新设置**
   - 打开应用程序
   - 导航到 "设置" 页面
   - 在 "自动更新" 部分可以：
     - 开启/关闭自动下载
     - 查看当前版本
     - 手动检查更新

### 发布新版本

1. **更新版本号**
   ```bash
   npm version patch  # 补丁版本 (1.0.0 -> 1.0.1)
   npm version minor  # 次版本 (1.0.0 -> 1.1.0)
   npm version major  # 主版本 (1.0.0 -> 2.0.0)
   ```

2. **构建和发布**
   ```bash
   # 构建所有平台
   npm run dist
   
   # 或者构建特定平台
   npm run dist:win   # Windows
   npm run dist:mac   # macOS  
   npm run dist:linux # Linux
   ```

3. **上传到 GitHub Releases**
   - 手动上传构建文件到 GitHub Releases
   - 或使用 GitHub Actions 自动发布

### 开发环境测试

由于自动更新只在生产环境中工作，开发时可以：

1. **手动触发检查**
   - 在设置页面点击 "检查更新" 按钮
   - 或在开发者工具中调用：
     ```javascript
     window.electronAPI.updater.checkForUpdates()
     ```

2. **模拟更新**
   - 修改 `package.json` 中的版本号到较低版本
   - 构建应用程序
   - 运行时会检测到 GitHub 上的新版本

## API 接口

### 主进程 IPC 处理器
- `updater:check-for-updates` - 检查更新
- `updater:quit-and-install` - 退出并安装
- `updater:get-version` - 获取当前版本
- `updater:set-auto-download` - 设置自动下载
- `updater:get-auto-download` - 获取自动下载设置
- `updater:download-update` - 下载更新

### 渲染进程事件监听
- `update-checking` - 开始检查更新
- `update-available` - 发现可用更新
- `update-not-available` - 无可用更新
- `update-error` - 更新错误
- `update-download-progress` - 下载进度
- `update-downloaded` - 下载完成

## 配置选项

### electron-builder 配置

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "your-username",
      "repo": "your-repo"
    },
    "win": {
      "publisherName": "Your Company Name"
    },
    "mac": {
      "category": "public.app-category.developer-tools"
    },
    "linux": {
      "category": "Development"
    }
  }
}
```

### 更新检查配置

在 `main.ts` 中可以配置：
- 检查间隔
- 自动下载设置
- 更新服务器地址

## 故障排除

### 常见问题

1. **更新检查失败**
   - 检查网络连接
   - 确认 GitHub 仓库访问权限
   - 查看控制台错误日志

2. **下载失败**
   - 检查磁盘空间
   - 确认防火墙设置
   - 重试下载

3. **安装失败**
   - 确保应用程序有写入权限
   - 关闭杀毒软件临时保护
   - 以管理员身份运行

### 日志查看

更新相关日志会输出到：
- 控制台 (开发环境)
- 应用日志文件 (生产环境)

## 最佳实践

1. **版本管理**
   - 使用语义化版本号
   - 在发布前充分测试
   - 编写详细的更新日志

2. **用户体验**
   - 提供清晰的更新说明
   - 支持用户选择更新时机
   - 确保更新过程流畅

3. **安全考虑**
   - 使用 HTTPS 下载
   - 验证更新包完整性
   - 定期更新依赖项

## 技术实现

### 核心依赖
- `electron-updater` - 自动更新功能
- `electron-builder` - 应用打包和发布
- `electron-log` - 日志记录

### 文件结构
```
src/
├── main.ts                 # 主进程，包含更新逻辑
├── preload.ts              # 预加载脚本，暴露更新API
├── types.ts                # TypeScript 类型定义
└── renderer/
    ├── components/
    │   └── UpdateNotification.tsx  # 更新通知组件
    └── pages/
        └── Settings.tsx    # 设置页面，包含更新选项
```

此自动更新系统提供了完整的更新体验，从检查、下载到安装都有良好的用户界面和反馈机制。