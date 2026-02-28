/**
 * Electron 预加载脚本
 * @description 安全地暴露 API 给渲染进程
 */

import { contextBridge, ipcRenderer } from 'electron'

/**
 * 暴露给渲染进程的 API
 */
const electronAPI = {
  // ==================== 窗口控制 ====================
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized'),
    isFullScreen: () => ipcRenderer.invoke('window:isFullScreen'),
    toggleFullScreen: () => ipcRenderer.invoke('window:toggleFullScreen'),
    // 监听窗口状态变化
    onMaximizedChange: (callback: (isMaximized: boolean) => void) => {
      ipcRenderer.on('window:maximized', (_event, isMaximized) => callback(isMaximized))
      return () => ipcRenderer.removeAllListeners('window:maximized')
    },
    onFullScreenChange: (callback: (isFullScreen: boolean) => void) => {
      ipcRenderer.on('window:fullscreen', (_event, isFullScreen) => callback(isFullScreen))
      return () => ipcRenderer.removeAllListeners('window:fullscreen')
    },
    onFocusChange: (callback: (isFocused: boolean) => void) => {
      ipcRenderer.on('window:focus', (_event, isFocused) => callback(isFocused))
      return () => ipcRenderer.removeAllListeners('window:focus')
    }
  },

  // ==================== 文档操作 ====================
  document: {
    create: (data: unknown) => ipcRenderer.invoke('document:create', data),
    get: (id: string) => ipcRenderer.invoke('document:get', id),
    update: (id: string, data: unknown) => ipcRenderer.invoke('document:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('document:delete', id),
    list: () => ipcRenderer.invoke('document:list')
  },

  // ==================== 模板操作 ====================
  template: {
    list: () => ipcRenderer.invoke('template:list'),
    get: (id: string) => ipcRenderer.invoke('template:get', id),
    create: (data: unknown) => ipcRenderer.invoke('template:create', data)
  },

  // ==================== 文件系统 ====================
  fs: {
    openFileDialog: (options?: unknown) => ipcRenderer.invoke('fs:open-file-dialog', options),
    saveFileDialog: (options?: unknown) => ipcRenderer.invoke('fs:save-file-dialog', options),
    readFile: (filePath: string) => ipcRenderer.invoke('fs:read-file', filePath),
    writeFile: (filePath: string, data: string) => ipcRenderer.invoke('fs:write-file', filePath, data),
    getAppPath: () => ipcRenderer.invoke('fs:get-app-path'),
    getDocumentsPath: () => ipcRenderer.invoke('fs:get-documents-path')
  },

  // ==================== 数据库 ====================
  db: {
    query: (sql: string, params?: unknown[]) => ipcRenderer.invoke('db:query', sql, params),
    run: (sql: string, params?: unknown[]) => ipcRenderer.invoke('db:run', sql, params),
    get: (sql: string, params?: unknown[]) => ipcRenderer.invoke('db:get', sql, params)
  },

  // ==================== AI 服务 ====================
  ai: {
    chat: (messages: unknown[], options?: unknown) => ipcRenderer.invoke('ai:chat', messages, options),
    generate: (prompt: string, options?: unknown) => ipcRenderer.invoke('ai:generate', prompt, options),
    review: (content: string, rules?: string[]) => ipcRenderer.invoke('ai:review', content, rules),
    setProvider: (provider: string) => ipcRenderer.invoke('ai:set-provider', provider),
    getProviders: () => ipcRenderer.invoke('ai:get-providers'),
    getCurrentProvider: () => ipcRenderer.invoke('ai:get-current-provider')
  },

  // ==================== 设置 ====================
  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value),
    getAll: () => ipcRenderer.invoke('settings:get-all'),
    delete: (key: string) => ipcRenderer.invoke('settings:delete', key)
  },

  // ==================== 菜单事件监听 ====================
  onMenuAction: (callback: (action: string) => void) => {
    const channels = [
      'menu:new-document',
      'menu:open-document',
      'menu:save-document',
      'menu:save-as-document',
      'menu:export-docx',
      'menu:export-pdf',
      'menu:about'
    ]
    
    const handlers: Array<() => void> = []
    
    channels.forEach((channel) => {
      const handler = () => callback(channel)
      ipcRenderer.on(channel, handler)
      handlers.push(() => ipcRenderer.removeListener(channel, handler))
    })
    
    // 返回清理函数
    return () => handlers.forEach((cleanup) => cleanup())
  }
}

// 暴露 API 到渲染进程的 window 对象
contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// TypeScript 类型声明
export type ElectronAPI = typeof electronAPI
