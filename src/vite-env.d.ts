/// <reference types="vite/client" />

/**
 * Electron API 类型声明
 */
interface ElectronAPI {
  document: {
    create: (data: unknown) => Promise<{ success: boolean; id: string }>
    get: (id: string) => Promise<unknown>
    update: (id: string, data: unknown) => Promise<{ success: boolean }>
    delete: (id: string) => Promise<{ success: boolean }>
    list: () => Promise<unknown[]>
  }
  template: {
    list: () => Promise<unknown[]>
    get: (id: string) => Promise<unknown>
    create: (data: unknown) => Promise<{ success: boolean; id: string }>
  }
  fs: {
    openFileDialog: (options?: unknown) => Promise<{ canceled: boolean; filePaths: string[] }>
    saveFileDialog: (options?: unknown) => Promise<{ canceled: boolean; filePath?: string }>
    readFile: (filePath: string) => Promise<string>
    writeFile: (filePath: string, data: string) => Promise<{ success: boolean }>
    getAppPath: () => Promise<string>
    getDocumentsPath: () => Promise<string>
  }
  db: {
    query: (sql: string, params?: unknown[]) => Promise<unknown[]>
    run: (sql: string, params?: unknown[]) => Promise<unknown>
    get: (sql: string, params?: unknown[]) => Promise<unknown>
  }
  ai: {
    chat: (messages: unknown[], options?: unknown) => Promise<{ content: string; model: string }>
    generate: (prompt: string, options?: unknown) => Promise<{ content: string; model: string }>
    review: (content: string, rules?: string[]) => Promise<{
      passed: boolean
      issues: unknown[]
      suggestions: string[]
      score: number
    }>
    setProvider: (provider: string) => Promise<{ success: boolean }>
    getProviders: () => Promise<unknown[]>
    getCurrentProvider: () => Promise<string>
  }
  settings: {
    get: (key: string) => Promise<unknown>
    set: (key: string, value: unknown) => Promise<{ success: boolean }>
    getAll: () => Promise<Record<string, unknown>>
    delete: (key: string) => Promise<{ success: boolean }>
  }
  onMenuAction: (callback: (action: string) => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
