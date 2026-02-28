/**
 * 窗口控制 IPC 处理器
 * @description 处理窗口最小化、最大化、关闭等操作
 */

import { ipcMain, BrowserWindow } from 'electron'

/**
 * 注册窗口控制相关的 IPC 处理器
 */
export function registerWindowHandlers(): void {
  // 最小化窗口
  ipcMain.handle('window:minimize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.minimize()
    }
  })

  // 最大化/还原窗口
  ipcMain.handle('window:maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize()
      } else {
        window.maximize()
      }
    }
  })

  // 关闭窗口
  ipcMain.handle('window:close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.close()
    }
  })

  // 获取窗口是否最大化
  ipcMain.handle('window:isMaximized', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    return window?.isMaximized() ?? false
  })

  // 获取窗口是否全屏
  ipcMain.handle('window:isFullScreen', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    return window?.isFullScreen() ?? false
  })

  // 切换全屏
  ipcMain.handle('window:toggleFullScreen', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.setFullScreen(!window.isFullScreen())
    }
  })

  console.log('[IPC] Window handlers registered')
}

/**
 * 为指定窗口添加窗口状态变化事件监听
 */
export function setupWindowStateListeners(window: BrowserWindow): void {
  // 最大化状态变化
  window.on('maximize', () => {
    window.webContents.send('window:maximized', true)
  })

  window.on('unmaximize', () => {
    window.webContents.send('window:maximized', false)
  })

  // 全屏状态变化
  window.on('enter-full-screen', () => {
    window.webContents.send('window:fullscreen', true)
  })

  window.on('leave-full-screen', () => {
    window.webContents.send('window:fullscreen', false)
  })

  // 聚焦状态变化
  window.on('focus', () => {
    window.webContents.send('window:focus', true)
  })

  window.on('blur', () => {
    window.webContents.send('window:focus', false)
  })
}
