/**
 * IPC 通信处理器注册
 * @description 注册所有 IPC 处理器，实现主进程与渲染进程通信
 */

import { ipcMain } from 'electron'
import { documentIpcHandlers } from './document'
import { templateIpcHandlers } from './template'
import { fileSystemIpcHandlers } from './file-system'
import { databaseIpcHandlers } from './database'
import { aiIpcHandlers } from './ai'
import { settingsIpcHandlers } from './settings'
import { registerWindowHandlers } from './window'

/**
 * 注册所有 IPC 处理器
 */
export function registerIpcHandlers(): void {
  // 注册窗口控制处理器
  registerWindowHandlers()

  // 注册文档相关处理器
  documentIpcHandlers.forEach((handler) => {
    ipcMain.handle(handler.channel, handler.handler)
  })

  // 注册模板相关处理器
  templateIpcHandlers.forEach((handler) => {
    ipcMain.handle(handler.channel, handler.handler)
  })

  // 注册文件系统处理器
  fileSystemIpcHandlers.forEach((handler) => {
    ipcMain.handle(handler.channel, handler.handler)
  })

  // 注册数据库处理器
  databaseIpcHandlers.forEach((handler) => {
    ipcMain.handle(handler.channel, handler.handler)
  })

  // 注册 AI 服务处理器
  aiIpcHandlers.forEach((handler) => {
    ipcMain.handle(handler.channel, handler.handler)
  })

  // 注册设置处理器
  settingsIpcHandlers.forEach((handler) => {
    ipcMain.handle(handler.channel, handler.handler)
  })

  console.log('[IPC] All handlers registered successfully')
}

/**
 * IPC 处理器接口
 */
export interface IpcHandler {
  channel: string
  handler: (event: Electron.IpcMainInvokeEvent, ...args: unknown[]) => Promise<unknown>
}
