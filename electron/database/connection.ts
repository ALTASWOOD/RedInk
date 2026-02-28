/**
 * SQLite 数据库连接管理
 * @description 使用 better-sqlite3 管理本地数据库
 */

import Database, { Database as DatabaseType } from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

// 数据库实例
let db: DatabaseType | null = null

/**
 * 获取数据库文件路径
 */
function getDatabasePath(): string {
  const userDataPath = app.getPath('userData')
  const dbDir = join(userDataPath, 'data')
  
  // 确保目录存在
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }
  
  return join(dbDir, 'redink.db')
}

/**
 * 初始化数据库表结构
 */
function initTables(database: DatabaseType): void {
  // 文档表
  database.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      type TEXT NOT NULL,
      template_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME
    )
  `)

  // 模板表
  database.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      content TEXT,
      type TEXT NOT NULL,
      is_builtin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 设置表
  database.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 素材表
  database.exec(`
    CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      content TEXT,
      category TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 操作日志表
  database.exec(`
    CREATE TABLE IF NOT EXISTS operation_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('[Database] Tables initialized')
}

/**
 * 初始化数据库连接
 */
export async function initDatabase(): Promise<void> {
  try {
    const dbPath = getDatabasePath()
    console.log('[Database] Initializing database at:', dbPath)
    
    db = new Database(dbPath)
    
    // 启用 WAL 模式提升性能
    db.pragma('journal_mode = WAL')
    
    // 初始化表结构
    initTables(db)
    
    console.log('[Database] Database initialized successfully')
  } catch (error) {
    console.error('[Database] Failed to initialize database:', error)
    throw error
  }
}

/**
 * 获取数据库实例
 */
export function getDatabase(): DatabaseType | null {
  return db
}

/**
 * 关闭数据库连接
 */
export function closeDatabase(): void {
  if (db) {
    db.close()
    db = null
    console.log('[Database] Database connection closed')
  }
}
