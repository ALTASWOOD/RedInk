/**
 * 数据库相关 IPC 处理器
 */

import type { IpcHandler } from './index'
import { getDatabase } from '../database/connection'

export const databaseIpcHandlers: IpcHandler[] = [
  {
    channel: 'db:query',
    handler: async (_event, sql: string, params?: unknown[]) => {
      const db = getDatabase()
      if (!db) throw new Error('Database not initialized')
      
      const stmt = db.prepare(sql)
      return params ? stmt.all(...params) : stmt.all()
    }
  },
  {
    channel: 'db:run',
    handler: async (_event, sql: string, params?: unknown[]) => {
      const db = getDatabase()
      if (!db) throw new Error('Database not initialized')
      
      const stmt = db.prepare(sql)
      return params ? stmt.run(...params) : stmt.run()
    }
  },
  {
    channel: 'db:get',
    handler: async (_event, sql: string, params?: unknown[]) => {
      const db = getDatabase()
      if (!db) throw new Error('Database not initialized')
      
      const stmt = db.prepare(sql)
      return params ? stmt.get(...params) : stmt.get()
    }
  }
]
