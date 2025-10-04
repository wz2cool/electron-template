@echo off
echo 准备上传 v1.1.0 版本到 GitHub Releases...

REM 检查是否安装了 GitHub CLI
gh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未安装 GitHub CLI (gh)
    echo 请访问 https://cli.github.com/ 下载安装
    pause
    exit /b 1
)

REM 切换到 release 目录
cd /d "%~dp0release"

REM 创建 release 并上传文件
gh release create v1.1.0 ^
    "Electron Template Setup 1.0.0.exe" ^
    "latest.yml" ^
    "Electron Template Setup 1.0.0.exe.blockmap" ^
    --title "Electron Template v1.0.0" ^
    --notes-file "../RELEASE_NOTES_v1.1.0.md" ^
    --repo yourname/electron-template

if %errorlevel% equ 0 (
    echo ✅ 成功上传 v1.1.0 版本到 GitHub Releases
    echo 🔗 查看: https://github.com/yourname/electron-template/releases/tag/v1.0.0
) else (
    echo ❌ 上传失败，请检查网络连接和权限
)

pause