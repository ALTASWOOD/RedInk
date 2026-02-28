/**
 * 文档相关 IPC 处理器
 */

import type { IpcHandler } from './index'

export const documentIpcHandlers: IpcHandler[] = [
  {
    channel: 'document:create',
    handler: async (_event, data: unknown) => {
      console.log('[IPC] document:create', data)
      // TODO: 实现文档创建逻辑
      return { success: true, id: Date.now().toString() }
    }
  },
  {
    channel: 'document:get',
    handler: async (_event, id: string) => {
      console.log('[IPC] document:get', id)
      // TODO: 实现获取文档逻辑
      return null
    }
  },
  {
    channel: 'document:update',
    handler: async (_event, id: string, data: unknown) => {
      console.log('[IPC] document:update', id, data)
      // TODO: 实现更新文档逻辑
      return { success: true }
    }
  },
  {
    channel: 'document:delete',
    handler: async (_event, id: string) => {
      console.log('[IPC] document:delete', id)
      // TODO: 实现删除文档逻辑
      return { success: true }
    }
  },
  {
    channel: 'document:list',
    handler: async () => {
      console.log('[IPC] document:list')
      // TODO: 实现获取文档列表逻辑
      return []
    }
  }
]
