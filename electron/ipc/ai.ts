/**
 * AI 服务相关 IPC 处理器
 */

import type { IpcHandler } from './index'
import { AIManager } from '../ai/manager'

export const aiIpcHandlers: IpcHandler[] = [
  {
    channel: 'ai:chat',
    handler: async (_event, messages: unknown[], options?: unknown) => {
      console.log('[IPC] ai:chat', { messages, options })
      const manager = AIManager.getInstance()
      return await manager.chat(messages as AIMessage[], options as AIOptions)
    }
  },
  {
    channel: 'ai:generate',
    handler: async (_event, prompt: string, options?: unknown) => {
      console.log('[IPC] ai:generate', { prompt, options })
      const manager = AIManager.getInstance()
      return await manager.generate(prompt, options as AIOptions)
    }
  },
  {
    channel: 'ai:review',
    handler: async (_event, content: string, rules?: string[]) => {
      console.log('[IPC] ai:review', { content, rules })
      const manager = AIManager.getInstance()
      return await manager.review(content, rules)
    }
  },
  {
    channel: 'ai:set-provider',
    handler: async (_event, provider: string) => {
      console.log('[IPC] ai:set-provider', provider)
      const manager = AIManager.getInstance()
      manager.setProvider(provider)
      return { success: true }
    }
  },
  {
    channel: 'ai:get-providers',
    handler: async () => {
      const manager = AIManager.getInstance()
      return manager.getAvailableProviders()
    }
  },
  {
    channel: 'ai:get-current-provider',
    handler: async () => {
      const manager = AIManager.getInstance()
      return manager.getCurrentProvider()
    }
  }
]

// 临时类型定义
interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AIOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}
