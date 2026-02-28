/**
 * AI 适配器接口定义
 * @description 定义 AI 服务的统一接口，支持多种 AI 提供商
 */

/**
 * AI 消息类型
 */
export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * AI 请求配置
 */
export interface AIRequestOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

/**
 * AI 响应类型
 */
export interface AIResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * 审核结果类型
 */
export interface ReviewResult {
  passed: boolean
  issues: ReviewIssue[]
  suggestions: string[]
  score: number
}

export interface ReviewIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  position?: {
    start: number
    end: number
  }
  rule?: string
}

/**
 * AI 适配器基类接口
 */
export interface AIAdapter {
  /** 提供商名称 */
  readonly name: string
  
  /** 提供商标识 */
  readonly provider: string
  
  /** 是否可用 */
  isAvailable(): Promise<boolean>
  
  /** 聊天对话 */
  chat(messages: AIMessage[], options?: AIRequestOptions): Promise<AIResponse>
  
  /** 单次生成 */
  generate(prompt: string, options?: AIRequestOptions): Promise<AIResponse>
  
  /** 内容审核 */
  review(content: string, rules?: string[]): Promise<ReviewResult>
}

/**
 * AI 适配器配置
 */
export interface AIAdapterConfig {
  apiKey?: string
  baseUrl?: string
  model?: string
  timeout?: number
}
