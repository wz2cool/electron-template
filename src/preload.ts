import { contextBridge, ipcRenderer } from 'electron';

// 暴露受保护的方法给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  getVersions: () => ({
    chrome: (process.versions as any).chrome,
    node: (process.versions as any).node,
    electron: (process.versions as any).electron
  }),
  // 窗口控制 API
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    onStateChanged: (callback: (state: { isMaximized: boolean }) => void) => {
      ipcRenderer.on('window-state-changed', (_, state) => callback(state));
    },
    removeStateListener: () => {
      ipcRenderer.removeAllListeners('window-state-changed');
    }
  },
  // 用户管理 API
  user: {
    getAll: () => ipcRenderer.invoke('user:getAll'),
    getById: (id: number) => ipcRenderer.invoke('user:getById', id),
    create: (userData: any) => ipcRenderer.invoke('user:create', userData),
    update: (id: number, userData: any) => ipcRenderer.invoke('user:update', id, userData),
    delete: (id: number) => ipcRenderer.invoke('user:delete', id),
    search: (query: string) => ipcRenderer.invoke('user:search', query),
    updateStatus: (id: number, status: string) => ipcRenderer.invoke('user:updateStatus', id, status),
    getStats: () => ipcRenderer.invoke('user:getStats')
  },
  // 更新管理 API
  updater: {
    checkForUpdates: () => ipcRenderer.invoke('updater:check-for-updates'),
    quitAndInstall: () => ipcRenderer.invoke('updater:quit-and-install'),
    getVersion: () => ipcRenderer.invoke('updater:get-version'),
    setAutoDownload: (enabled: boolean) => ipcRenderer.invoke('updater:set-auto-download', enabled),
    getAutoDownload: () => ipcRenderer.invoke('updater:get-auto-download'),
    downloadUpdate: () => ipcRenderer.invoke('updater:download-update'),
    // 更新事件监听
    onUpdateChecking: (callback: () => void) => {
      ipcRenderer.on('update-checking', callback);
    },
    onUpdateAvailable: (callback: (info: any) => void) => {
      ipcRenderer.on('update-available', (_, info) => callback(info));
    },
    onUpdateNotAvailable: (callback: (info: any) => void) => {
      ipcRenderer.on('update-not-available', (_, info) => callback(info));
    },
    onUpdateError: (callback: (error: string) => void) => {
      ipcRenderer.on('update-error', (_, error) => callback(error));
    },
    onDownloadProgress: (callback: (progress: any) => void) => {
      ipcRenderer.on('update-download-progress', (_, progress) => callback(progress));
    },
    onUpdateDownloaded: (callback: (info: any) => void) => {
      ipcRenderer.on('update-downloaded', (_, info) => callback(info));
    },
    // 移除更新事件监听
    removeUpdateListeners: () => {
      ipcRenderer.removeAllListeners('update-checking');
      ipcRenderer.removeAllListeners('update-available');
      ipcRenderer.removeAllListeners('update-not-available');
      ipcRenderer.removeAllListeners('update-error');
      ipcRenderer.removeAllListeners('update-download-progress');
      ipcRenderer.removeAllListeners('update-downloaded');
    }
  }
});