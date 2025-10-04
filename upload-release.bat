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
    "OurUI Tool V4 Setup 1.1.0.exe" ^
    "latest.yml" ^
    "OurUI Tool V4 Setup 1.1.0.exe.blockmap" ^
    --title "OurUI Tool V4 v1.1.0" ^
    --notes-file "../RELEASE_NOTES_v1.1.0.md" ^
    --repo wz2cool/ourui-tool-v4

if %errorlevel% equ 0 (
    echo ✅ 成功上传 v1.1.0 版本到 GitHub Releases
    echo 🔗 查看: https://github.com/wz2cool/ourui-tool-v4/releases/tag/v1.1.0
) else (
    echo ❌ 上传失败，请检查网络连接和权限
)

pause