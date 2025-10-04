# Electron Template

基于 Electron + TypeScript 的桌面应用工具

## 项目结构

```
electron-template/
├── src/
│   ├── main.ts          # 主进程文件
│   ├── preload.ts       # 预加载脚本
│   └── renderer/        # 渲染进程文件
│       ├── index.html   # 主页面
│       └── renderer.ts  # 渲染进程脚本
├── dist/                # 编译输出目录
├── release/             # 打包输出目录
├── tsconfig.json        # TypeScript 配置
├── package.json         # 项目配置
└── .npmrc              # npm 配置
```

## 开发环境要求

- Node.js >= 16
- npm >= 8

## 安装依赖

```bash
npm install
```

## 开发命令

```bash
# 编译 TypeScript
npm run build

# 监听模式编译
npm run build:watch

# 启动应用
npm start

# 开发模式（监听 + 启动）
npm run dev

# 清理编译文件
npm run clean
```

## 打包命令

```bash
# 打包到目录（不生成安装包）
npm run pack

# 生成安装包
npm run dist

# 针对特定平台打包
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

## 技术栈

- **Electron**: 跨平台桌面应用框架
- **TypeScript**: 类型安全的 JavaScript
- **electron-builder**: 应用打包工具

## 功能特性

- ✅ TypeScript 支持
- ✅ 现代化 UI 界面
- ✅ 安全的进程间通信
- ✅ 跨平台打包支持
- ✅ 开发热重载

## 开发说明

1. 主进程代码位于 `src/main.ts`
2. 渲染进程代码位于 `src/renderer/`
3. 预加载脚本位于 `src/preload.ts`
4. 编译后的文件输出到 `dist/` 目录
5. 打包后的应用输出到 `release/` 目录

## 许可证

MIT License