import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { runMigrations, seedDefaultAdmin } from './database/migrations';
import { UserService } from './services/userService';

// 配置 electron-log
log.transports.file.level = 'info';
log.transports.console.level = 'debug';
log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

// 配置 electron-updater 日志
autoUpdater.logger = log;

let mainWindow: BrowserWindow;

// Auto-updater event handlers
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
  if (mainWindow) {
    mainWindow.webContents.send('update-checking');
  }
});

autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-available', info);
  }
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-not-available', info);
  }
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater:', err);
  if (mainWindow) {
    mainWindow.webContents.send('update-error', err.message);
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = 'Download speed: ' + progressObj.bytesPerSecond;
  logMessage = logMessage + ' - Downloaded ' + progressObj.percent + '%';
  logMessage = logMessage + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
  log.info(logMessage);
  if (mainWindow) {
    mainWindow.webContents.send('update-download-progress', progressObj);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-downloaded', info);
  }
});

function createWindow(): void {
  log.info('Creating main window...');
  
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    frame: false, // 禁用默认窗口框架
    titleBarStyle: 'hidden', // 隐藏标题栏
    show: false, // 初始时不显示窗口，等待内容加载完成
    backgroundColor: '#f5f7fa', // 设置背景色，减少白屏效果
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  log.info('Main window created successfully');

  // 加载应用的 index.html - 使用构建后的文件
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  log.info('Loading renderer HTML file');

  // 当页面准备好显示时才显示窗口
  mainWindow.once('ready-to-show', () => {
    log.info('Window ready to show');
    mainWindow.show();
    
    // 可选：添加淡入效果
    mainWindow.setOpacity(0);
    mainWindow.show();
    
    let opacity = 0;
    const fadeIn = setInterval(() => {
      opacity += 0.1;
      mainWindow.setOpacity(opacity);
      if (opacity >= 1) {
        clearInterval(fadeIn);
      }
    }, 30);
  });

  // 打开开发者工具
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
    log.debug('Development mode: DevTools opened');
  }

  // 监听窗口状态变化
  mainWindow.on('maximize', () => {
    log.debug('Window maximized');
    mainWindow.webContents.send('window-state-changed', { isMaximized: true });
  });

  mainWindow.on('unmaximize', () => {
    log.debug('Window unmaximized');
    mainWindow.webContents.send('window-state-changed', { isMaximized: false });
  });
}

// 处理文件打开对话框
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Text Files', extensions: ['txt', 'md'] },
      { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
    ]
  });
  
  if (result.canceled) {
    return null;
  }
  
  return result.filePaths[0];
});

// 窗口控制 IPC 处理
ipcMain.handle('window:minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window:close', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle('window:isMaximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// 用户管理 IPC 处理
ipcMain.handle('user:getAll', async () => {
  log.info('IPC: user:getAll - Getting all users');
  try {
    const users = await UserService.getAllUsers();
    log.info(`IPC: user:getAll - Successfully retrieved ${users.length} users`);
    return users;
  } catch (error) {
    log.error('IPC: user:getAll - Error getting all users:', error);
    throw error;
  }
});

ipcMain.handle('user:getById', async (_, id: number) => {
  log.info(`IPC: user:getById - Getting user with id: ${id}`);
  try {
    const user = await UserService.getUserById(id);
    log.info(`IPC: user:getById - Successfully retrieved user: ${user?.username || 'not found'}`);
    return user;
  } catch (error) {
    log.error(`IPC: user:getById - Error getting user by id ${id}:`, error);
    throw error;
  }
});

ipcMain.handle('user:create', async (_, userData: any) => {
  log.info(`IPC: user:create - Creating new user: ${userData.username}`);
  try {
    const user = await UserService.createUser(userData);
    log.info(`IPC: user:create - Successfully created user with id: ${user.id}`);
    return user;
  } catch (error) {
    log.error(`IPC: user:create - Error creating user ${userData.username}:`, error);
    throw error;
  }
});

ipcMain.handle('user:update', async (_, id: number, userData: any) => {
  log.info(`IPC: user:update - Updating user with id: ${id}`);
  try {
    const user = await UserService.updateUser(id, userData);
    log.info(`IPC: user:update - Successfully updated user: ${user.username}`);
    return user;
  } catch (error) {
    log.error(`IPC: user:update - Error updating user ${id}:`, error);
    throw error;
  }
});

ipcMain.handle('user:delete', async (_, id: number) => {
  log.info(`IPC: user:delete - Deleting user with id: ${id}`);
  try {
    const result = await UserService.deleteUser(id);
    log.info(`IPC: user:delete - Successfully deleted user with id: ${id}`);
    return result;
  } catch (error) {
    log.error(`IPC: user:delete - Error deleting user ${id}:`, error);
    throw error;
  }
});

ipcMain.handle('user:search', async (_, query: string) => {
  log.info(`IPC: user:search - Searching users with query: "${query}"`);
  try {
    const users = await UserService.searchUsers(query);
    log.info(`IPC: user:search - Found ${users.length} users matching query: "${query}"`);
    return users;
  } catch (error) {
    log.error(`IPC: user:search - Error searching users with query "${query}":`, error);
    throw error;
  }
});

ipcMain.handle('user:updateStatus', async (_, id: number, status: 'active' | 'inactive' | 'banned') => {
  log.info(`IPC: user:updateStatus - Updating user ${id} status to: ${status}`);
  try {
    const user = await UserService.updateUserStatus(id, status);
    log.info(`IPC: user:updateStatus - Successfully updated user ${id} status to: ${status}`);
    return user;
  } catch (error) {
    log.error(`IPC: user:updateStatus - Error updating user ${id} status to ${status}:`, error);
    throw error;
  }
});

ipcMain.handle('user:getStats', async () => {
  log.info('IPC: user:getStats - Getting user statistics');
  try {
    const stats = await UserService.getUserStats();
    log.info(`IPC: user:getStats - Successfully retrieved stats: ${JSON.stringify(stats)}`);
    return stats;
  } catch (error) {
    log.error('IPC: user:getStats - Error getting user stats:', error);
    throw error;
  }
});

// Auto-updater IPC handlers
ipcMain.handle('updater:check-for-updates', async () => {
  log.info('IPC: updater:check-for-updates - Checking for updates manually');
  try {
    const result = await autoUpdater.checkForUpdatesAndNotify();
    return result;
  } catch (error) {
    log.error('IPC: updater:check-for-updates - Error checking for updates:', error);
    throw error;
  }
});

ipcMain.handle('updater:quit-and-install', () => {
  log.info('IPC: updater:quit-and-install - Quitting and installing update');
  autoUpdater.quitAndInstall();
});

ipcMain.handle('updater:get-version', () => {
  return app.getVersion();
});

ipcMain.handle('updater:set-auto-download', (_, enabled: boolean) => {
  log.info(`IPC: updater:set-auto-download - Setting auto download to: ${enabled}`);
  autoUpdater.autoDownload = enabled;
  return autoUpdater.autoDownload;
});

ipcMain.handle('updater:get-auto-download', () => {
  return autoUpdater.autoDownload;
});

ipcMain.handle('updater:download-update', async () => {
  log.info('IPC: updater:download-update - Starting update download');
  try {
    await autoUpdater.downloadUpdate();
    return true;
  } catch (error) {
    log.error('IPC: updater:download-update - Error downloading update:', error);
    throw error;
  }
});

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(async () => {
  log.info('Application is ready, starting initialization...');
  
  // 先创建窗口（但不显示），让用户看到应用正在启动
  createWindow();
  
  try {
    // 在后台进行数据库初始化
    log.info('Running database migrations...');
    await runMigrations();
    log.info('Database migrations completed successfully');
    
    log.info('Seeding default admin user...');
    await seedDefaultAdmin();
    log.info('Default admin user seeded successfully');
    
    log.info('Application initialization completed');
    
    // Check for updates after initialization (only in production)
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
      log.info('Checking for updates...');
      setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify().catch(err => {
          log.error('Error checking for updates:', err);
        });
      }, 3000); // Wait 3 seconds after app startup
    }
  } catch (error) {
    log.error('Error during application initialization:', error);
    // 即使数据库初始化失败，也要显示应用
    // 可以在应用中显示错误信息
  }
});

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  log.info('All windows closed');
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    log.info('Quitting application');
    app.quit();
  }
});

app.on('activate', () => {
  log.info('Application activated');
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (BrowserWindow.getAllWindows().length === 0) {
    log.info('No windows open, creating new window');
    createWindow();
  }
});

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。