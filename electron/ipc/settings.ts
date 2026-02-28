/**
 * 设置相关 IPC 处理器
 */

import type { IpcHandler } from './index'
import { getDatabase } from '../database/connection'

export const settingsIpcHandlers: IpcHandler[] = [
  {
    channel: 'settings:get',
    handler: async (_event, key: string) => {
      const db = getDatabase()
      if (!db) return null
      
      const result = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined
      return result ? JSON.parse(result.value) : null
    }
  },
  {
    channel: 'settings:set',
    handler: async (_event, key: string, value: unknown) => {
      const db = getDatabase()
      if (!db) throw new Error('Database not initialized')
      
      const jsonValue = JSON.stringify(value)
      db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, jsonValue)
      return { success: true }
    }
  },
  {
    channel: 'settings:get-all',
    handler: async () => {
      const db = getDatabase()
      if (!db) return {}
      
      const results = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[]
      const settings: Record<string, unknown> = {}
      results.forEach((row) => {
        settings[row.key] = JSON.parse(row.value)
      })
      return settings
    }
  },
  {
    channel: 'settings:delete',
    handler: async (_event, key: string) => {
      const db = getDatabase()
      if (!db) throw new Error('Database not initialized')
      
      db.prepare('DELETE FROM settings WHERE key = ?').run(key)
      return { success: true }
    }
  }
]
