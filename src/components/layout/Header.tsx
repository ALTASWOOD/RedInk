/**
 * 顶部环境状态栏组件
 * 显示当前环境状态，提供环境切换功能
 */

import { Modal, Space, Tooltip } from 'antd'
import {
  CloudOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
  SettingOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useEnvStore } from '@stores/envStore'

export default function Header() {
  const navigate = useNavigate()
  const { environment, setEnvironment, showSwitchConfirm, showConfirm, hideConfirm } = useEnvStore()

  const isPublic = environment === 'public'
  
  // 环境切换处理
  const handleEnvironmentSwitch = () => {
    if (!isPublic) {
      // 从私域切换到公网需要确认
      showConfirm()
    } else {
      setEnvironment('private')
    }
  }

  const confirmSwitch = () => {
    setEnvironment('public')
    hideConfirm()
  }

  return (
    <>
      <header className={`env-header ${isPublic ? 'env-public' : 'env-private'}`}>
        {/* 左侧：环境标识 */}
        <div className="env-header-left">
          <span className="env-icon">
            {isPublic ? <CloudOutlined /> : <SafetyCertificateOutlined />}
          </span>
          <span className="env-text">
            {isPublic ? '公网环境' : '私域环境'}
          </span>
          <span className="env-desc">
            {isPublic ? '' : '- 数据本地处理'}
          </span>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="env-header-right">
          {/* 环境切换按钮 */}
          <Tooltip title={isPublic ? '切换到私域环境' : '切换到公网环境'}>
            <button className="env-switch-btn" onClick={handleEnvironmentSwitch}>
              <SwapOutlined />
              <span>切换到{isPublic ? '私域' : '公网'}</span>
              {isPublic ? <SafetyCertificateOutlined /> : <CloudOutlined />}
            </button>
          </Tooltip>

          {/* 设置按钮 */}
          <Tooltip title="设置">
            <button 
              className="env-settings-btn" 
              onClick={() => navigate('/settings')}
            >
              <SettingOutlined />
            </button>
          </Tooltip>
        </div>
      </header>

      {/* 环境切换确认对话框 */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            <span>切换到公网环境</span>
          </Space>
        }
        open={showSwitchConfirm}
        onOk={confirmSwitch}
        onCancel={hideConfirm}
        okText="确认切换"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>您即将切换到<strong>公网环境</strong>，请注意：</p>
        <ul style={{ paddingLeft: 20, margin: '12px 0' }}>
          <li>公网环境下的数据可能通过互联网传输</li>
          <li>请勿在公网环境下处理涉密文档</li>
          <li>AI 服务将使用云端 API</li>
        </ul>
        <p>确定要切换吗？</p>
      </Modal>
    </>
  )
}
