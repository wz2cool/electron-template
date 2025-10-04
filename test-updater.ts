import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

// 配置日志
autoUpdater.logger = log;

// 测试自动更新功能
async function testAutoUpdater() {
  console.log('开始测试自动更新功能...');
  
  try {
    // 获取当前版本
    const currentVersion = app.getVersion();
    console.log(`当前版本: ${currentVersion}`);
    
    // 检查更新
    console.log('检查更新中...');
    const result = await autoUpdater.checkForUpdatesAndNotify();
    
    if (result) {
      console.log('检查更新完成');
      console.log('更新信息:', result.updateInfo);
      console.log('取消信息:', result.cancellationToken);
    } else {
      console.log('检查更新返回 null，可能是最新版本');
    }
    
  } catch (error) {
    console.error('更新检查失败:', error);
  }
}

// 设置更新事件监听器
autoUpdater.on('checking-for-update', () => {
  console.log('正在检查更新...');
});

autoUpdater.on('update-available', (info) => {
  console.log('发现可用更新:', info);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('没有可用更新:', info);
});

autoUpdater.on('error', (err) => {
  console.error('更新错误:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `下载速度: ${progressObj.bytesPerSecond}`;
  logMessage += ` - 已下载 ${progressObj.percent}%`;
  logMessage += ` (${progressObj.transferred}/${progressObj.total})`;
  console.log(logMessage);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('更新下载完成:', info);
});

// 导出测试函数
export { testAutoUpdater };