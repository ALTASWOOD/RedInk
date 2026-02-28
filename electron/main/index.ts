/**
 * Electron 主进程入口
 * @description 负责创建窗口、注册 IPC 处理器、初始化应用
 */

import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { registerIpcHandlers } from '../ipc'
import { initDatabase } from '../database/connection'
import { createMenu } from './menu'

// 禁用 Electron 安全警告（仅开发环境）
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 主窗口引用
let mainWindow: BrowserWindow | null = null

// 预加载脚本路径
const preloadPath = join(__dirname, '../preload/index.js')

// 开发环境 URL
const DEV_URL = 'http://localhost:5173'

/**
 * 创建主窗口
 */
async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    title: 'RedInk - AI公文报告编写软件',
    icon: join(__dirname, '../../public/icon.png'),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true
    },
    show: false,
    backgroundColor: '#f5f5f5'
  })

  // 窗口准备好后显示
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    // 开发环境打开开发者工具
    if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
      mainWindow?.webContents.openDevTools()
    }
  })

  // 窗口关闭时清理引用
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 拦截新窗口请求，用系统浏览器打开
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // 加载应用
  if (app.isPackaged) {
    // 生产环境加载打包后的文件
    await mainWindow.loadFile(join(__dirname, '../../dist/index.html'))
  } else {
    // 开发环境加载开发服务器
    await mainWindow.loadURL(DEV_URL)
  }
}

/**
 * 应用初始化
 */
async function initialize(): Promise<void> {
  // 初始化数据库
  await initDatabase()

  // 注册 IPC 处理器
  registerIpcHandlers()

  // 创建应用菜单
  createMenu()

  // 创建主窗口
  await createWindow()
}

// 应用准备就绪
app.whenReady().then(initialize).catch(console.error)

// 所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// macOS 点击 dock 图标时重新创建窗口
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 导出主窗口引用供其他模块使用
export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}
