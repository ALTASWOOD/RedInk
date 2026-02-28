/**
 * AI 助手面板组件
 * 位于主界面右侧，提供 AI 生成、审核、改写、对话功能
 */

import { useState } from 'react'
import { Button, Input, Empty, Tooltip } from 'antd'
import {
  MinusOutlined,
  SettingOutlined,
  SendOutlined,
  EditOutlined,
  FileSearchOutlined,
  ReloadOutlined,
  MessageOutlined,
  RobotOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'

type AITabType = 'generate' | 'review' | 'rewrite' | 'chat'

interface AIPanelProps {
  visible?: boolean
  onMinimize?: () => void
  aiStatus?: 'idle' | 'connecting' | 'connected' | 'error'
  aiModel?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const tabItems: { key: AITabType; label: string; icon: React.ReactNode }[] = [
  { key: 'generate', label: '生成', icon: <EditOutlined /> },
  { key: 'review', label: '审核', icon: <FileSearchOutlined /> },
  { key: 'rewrite', label: '改写', icon: <ReloadOutlined /> },
  { key: 'chat', label: '对话', icon: <MessageOutlined /> }
]

export default function AIPanel({
  visible = true,
  onMinimize,
  aiStatus = 'idle',
  aiModel = 'Ollama'
}: AIPanelProps) {
  const [activeTab, setActiveTab] = useState<AITabType>('generate')
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  if (!visible) return null

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setIsLoading(true)

    // 模拟 AI 响应
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '这是 AI 的模拟响应。实际功能将在后续版本中实现。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  const getPlaceholder = () => {
    switch (activeTab) {
      case 'generate':
        return '描述您需要生成的公文内容...'
      case 'review':
        return '选择要审核的内容，或描述审核要求...'
      case 'rewrite':
        return '描述改写要求，如：更正式、更简洁...'
      case 'chat':
        return '输入您的问题...'
      default:
        return '输入您的要求...'
    }
  }

  const renderContent = () => {
    if (messages.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span style={{ color: 'var(--color-text-secondary)' }}>
              {activeTab === 'generate' && '开始生成公文内容'}
              {activeTab === 'review' && '审核选中的文档内容'}
              {activeTab === 'rewrite' && '改写优化文档内容'}
              {activeTab === 'chat' && '与 AI 助手对话'}
            </span>
          }
        />
      )
    }

    return (
      <div className="ai-messages">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`ai-message ${msg.role}`}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              marginBottom: 'var(--spacing-sm)',
              borderRadius: 'var(--border-radius-lg)',
              background: msg.role === 'user' 
                ? 'var(--theme-color-bg)' 
                : 'var(--color-background-light)',
              marginLeft: msg.role === 'user' ? 'var(--spacing-lg)' : 0,
              marginRight: msg.role === 'assistant' ? 'var(--spacing-lg)' : 0
            }}
          >
            <div style={{ 
              fontSize: 'var(--font-size-sm)',
              color: msg.role === 'user' ? 'var(--theme-color)' : 'var(--color-text-primary)'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="ai-message assistant" style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            marginRight: 'var(--spacing-lg)',
            color: 'var(--color-text-secondary)'
          }}>
            AI 正在思考中...
          </div>
        )}
      </div>
    )
  }

  const getAiStatusDisplay = () => {
    switch (aiStatus) {
      case 'connected':
        return (
          <>
            <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
            <span>{aiModel} (已连接)</span>
          </>
        )
      case 'connecting':
        return <span>连接中...</span>
      case 'error':
        return <span style={{ color: 'var(--color-error)' }}>连接失败</span>
      default:
        return (
          <>
            <RobotOutlined />
            <span>{aiModel}</span>
          </>
        )
    }
  }

  return (
    <div className="ai-panel">
      {/* 面板头部 */}
      <div className="ai-panel-header">
        <h3>AI 助手</h3>
        <Tooltip title="最小化">
          <Button
            type="text"
            size="small"
            icon={<MinusOutlined />}
            onClick={onMinimize}
          />
        </Tooltip>
      </div>

      {/* 标签页 */}
      <div className="ai-panel-tabs">
        {tabItems.map(tab => (
          <div
            key={tab.key}
            className={`ai-panel-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            <span style={{ marginLeft: 4 }}>{tab.label}</span>
          </div>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="ai-panel-content">
        {renderContent()}
      </div>

      {/* 底部输入区 */}
      <div className="ai-panel-footer">
        <div className="ai-panel-input">
          <Input
            placeholder={getPlaceholder()}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onPressEnter={handleSend}
            disabled={isLoading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isLoading}
          />
        </div>
        <div className="ai-panel-status">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            {getAiStatusDisplay()}
          </div>
          <Tooltip title="AI 设置">
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
