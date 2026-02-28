/**
 * AI 服务管理器
 * @description 管理多个 AI 适配器，根据环境选择合适的 AI 服务
 */

import type {
  AIAdapter,
  AIMessage,
  AIRequestOptions,
  AIResponse,
  ReviewResult
} from './adapter'

/**
 * AI 提供商信息
 */
export interface AIProviderInfo {
  id: string
  name: string
  description: string
  isLocal: boolean
  isAvailable: boolean
}

/**
 * AI 服务管理器
 * 单例模式，统一管理所有 AI 适配器
 */
export class AIManager {
  private static instance: AIManager | null = null
  private adapters: Map<string, AIAdapter> = new Map()
  private currentProvider: string = 'mock'

  private constructor() {
    // 注册默认的 Mock 适配器（用于开发测试）
    this.registerMockAdapter()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): AIManager {
    if (!AIManager.instance) {
      AIManager.instance = new AIManager()
    }
    return AIManager.instance
  }

  /**
   * 注册 Mock 适配器（开发测试用）
   */
  private registerMockAdapter(): void {
    const mockAdapter: AIAdapter = {
      name: 'Mock AI',
      provider: 'mock',
      
      async isAvailable() {
        return true
      },
      
      async chat(messages: AIMessage[], _options?: AIRequestOptions): Promise<AIResponse> {
        const lastMessage = messages[messages.length - 1]
        return {
          content: `[Mock Response] 收到消息: "${lastMessage?.content || ''}"`,
          model: 'mock-model',
          usage: {
            promptTokens: 10,
            completionTokens: 20,
            totalTokens: 30
          }
        }
      },
      
      async generate(prompt: string, _options?: AIRequestOptions): Promise<AIResponse> {
        return {
          content: `[Mock Generated] 基于提示生成的内容: "${prompt.substring(0, 50)}..."`,
          model: 'mock-model'
        }
      },
      
      async review(content: string, _rules?: string[]): Promise<ReviewResult> {
        return {
          passed: true,
          issues: [],
          suggestions: [`建议检查文档格式是否符合公文规范（内容长度: ${content.length}）`],
          score: 85
        }
      }
    }
    
    this.adapters.set('mock', mockAdapter)
  }

  /**
   * 注册 AI 适配器
   */
  registerAdapter(adapter: AIAdapter): void {
    this.adapters.set(adapter.provider, adapter)
    console.log(`[AIManager] Registered adapter: ${adapter.name}`)
  }

  /**
   * 设置当前使用的 AI 提供商
   */
  setProvider(providerId: string): void {
    if (!this.adapters.has(providerId)) {
      throw new Error(`Unknown AI provider: ${providerId}`)
    }
    this.currentProvider = providerId
    console.log(`[AIManager] Switched to provider: ${providerId}`)
  }

  /**
   * 获取当前提供商
   */
  getCurrentProvider(): string {
    return this.currentProvider
  }

  /**
   * 获取可用的 AI 提供商列表
   */
  async getAvailableProviders(): Promise<AIProviderInfo[]> {
    const providers: AIProviderInfo[] = []
    
    for (const [id, adapter] of this.adapters) {
      const isAvailable = await adapter.isAvailable()
      providers.push({
        id,
        name: adapter.name,
        description: `${adapter.name} AI 服务`,
        isLocal: id === 'ollama',
        isAvailable
      })
    }
    
    return providers
  }

  /**
   * 获取当前适配器
   */
  private getCurrentAdapter(): AIAdapter {
    const adapter = this.adapters.get(this.currentProvider)
    if (!adapter) {
      throw new Error(`No adapter found for provider: ${this.currentProvider}`)
    }
    return adapter
  }

  /**
   * 聊天对话
   */
  async chat(messages: AIMessage[], options?: AIRequestOptions): Promise<AIResponse> {
    const adapter = this.getCurrentAdapter()
    return adapter.chat(messages, options)
  }

  /**
   * 单次生成
   */
  async generate(prompt: string, options?: AIRequestOptions): Promise<AIResponse> {
    const adapter = this.getCurrentAdapter()
    return adapter.generate(prompt, options)
  }

  /**
   * 内容审核
   */
  async review(content: string, rules?: string[]): Promise<ReviewResult> {
    const adapter = this.getCurrentAdapter()
    return adapter.review(content, rules)
  }
}
