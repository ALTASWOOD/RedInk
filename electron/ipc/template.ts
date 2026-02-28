/**
 * 模板相关 IPC 处理器
 */

import type { IpcHandler } from './index'

export const templateIpcHandlers: IpcHandler[] = [
  {
    channel: 'template:list',
    handler: async () => {
      console.log('[IPC] template:list')
      // TODO: 实现获取模板列表逻辑
      return []
    }
  },
  {
    channel: 'template:get',
    handler: async (_event, id: string) => {
      console.log('[IPC] template:get', id)
      // TODO: 实现获取模板逻辑
      return null
    }
  },
  {
    channel: 'template:create',
    handler: async (_event, data: unknown) => {
      console.log('[IPC] template:create', data)
      // TODO: 实现创建模板逻辑
      return { success: true, id: Date.now().toString() }
    }
  }
]
