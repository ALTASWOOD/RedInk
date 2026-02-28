/**
 * 底部状态栏组件
 * 显示文档信息、保存状态、AI状态和环境标识
 */

import { 
  CloudOutlined, 
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  RobotOutlined
} from '@ant-design/icons'
import { useEnvStore } from '@stores/envStore'

interface StatusBarProps {
  wordCount?: number
  savedTime?: string
  currentPage?: number
  totalPages?: number
  aiStatus?: 'idle' | 'connecting' | 'connected' | 'error'
  aiModel?: string
}

export default function StatusBar({
  wordCount = 0,
  savedTime,
  currentPage = 1,
  totalPages = 1,
  aiStatus = 'idle',
  aiModel = 'Ollama'
}: StatusBarProps) {
  const { environment } = useEnvStore()
  const isPublic = environment === 'public'

  const getAiStatusIcon = () => {
    switch (aiStatus) {
      case 'connecting':
        return <SyncOutlined spin />
      case 'connected':
        return <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
      case 'error':
        return <CheckCircleOutlined style={{ color: 'var(--color-error)' }} />
      default:
        return <RobotOutlined />
    }
  }

  const getAiStatusText = () => {
    switch (aiStatus) {
      case 'connecting':
        return '连接中...'
      case 'connected':
        return `${aiModel} 已连接`
      case 'error':
        return '连接失败'
      default:
        return aiModel
    }
  }

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        {/* 字数统计 */}
        <div className="status-bar-item">
          <span>字数: {wordCount.toLocaleString()}</span>
        </div>

        <div className="status-bar-divider" />

        {/* 保存状态 */}
        <div className="status-bar-item">
          {savedTime ? (
            <>
              <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
              <span>已保存 {savedTime}</span>
            </>
          ) : (
            <span>未保存</span>
          )}
        </div>

        <div className="status-bar-divider" />

        {/* 页码信息 */}
        <div className="status-bar-item">
          <span>第 {currentPage} 页 / 共 {totalPages} 页</span>
        </div>
      </div>

      <div className="status-bar-right">
        {/* AI 状态 */}
        <div className="status-bar-item">
          {getAiStatusIcon()}
          <span>{getAiStatusText()}</span>
        </div>

        <div className="status-bar-divider" />

        {/* 环境标识 */}
        <div className={`env-badge ${isPublic ? 'env-public' : 'env-private'}`}>
          {isPublic ? (
            <>
              <CloudOutlined />
              <span>公网环境</span>
            </>
          ) : (
            <>
              <SafetyCertificateOutlined />
              <span>私域环境</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
