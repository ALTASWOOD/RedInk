/**
 * 窗口管理模块
 * @description 提供窗口相关的工具函数
 */

import { BrowserWindow, screen } from 'electron'

/**
 * 窗口配置接口
 */
export interface WindowOptions {
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  title?: string
  modal?: boolean
  parent?: BrowserWindow | null
}

/**
 * 创建子窗口
 */
export function createChildWindow(
  url: string,
  options: WindowOptions = {}
): BrowserWindow {
  const {
    width = 800,
    height = 600,
    minWidth = 400,
    minHeight = 300,
    title = 'RedInk',
    modal = false,
    parent = null
  } = options

  const window = new BrowserWindow({
    width,
    height,
    minWidth,
    minHeight,
    title,
    modal,
    parent: parent ?? undefined,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    },
    show: false
  })

  window.on('ready-to-show', () => {
    window.show()
  })

  window.loadURL(url)

  return window
}

/**
 * 获取主显示器工作区域
 */
export function getPrimaryDisplayWorkArea() {
  const primaryDisplay = screen.getPrimaryDisplay()
  return primaryDisplay.workArea
}

/**
 * 居中窗口
 */
export function centerWindow(window: BrowserWindow): void {
  const workArea = getPrimaryDisplayWorkArea()
  const [width, height] = window.getSize()
  const x = Math.floor((workArea.width - width) / 2) + workArea.x
  const y = Math.floor((workArea.height - height) / 2) + workArea.y
  window.setPosition(x, y)
}
