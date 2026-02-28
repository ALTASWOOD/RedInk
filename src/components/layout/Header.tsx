/**
 * 顶部导航栏组件
 */

import { Layout, Button, Switch, Space, Typography, Modal, Tooltip } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
  LockOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { useEnvStore } from '@stores/envStore'

const { Header: AntHeader } = Layout
const { Text } = Typography

interface HeaderProps {
  collapsed: boolean
  onToggleCollapsed: () => void
}

export default function Header({ collapsed, onToggleCollapsed }: HeaderProps) {
  const { environment, setEnvironment, showSwitchConfirm, showConfirm, hideConfirm } = useEnvStore()

  const isPublic = environment === 'public'
  
  // 环境切换处理
  const handleEnvironmentChange = (checked: boolean) => {
    if (checked && environment === 'private') {
      // 从私域切换到公网需要确认
      showConfirm()
    } else {
      setEnvironment(checked ? 'public' : 'private')
    }
  }

  const confirmSwitch = () => {
    setEnvironment('public')
    hideConfirm()
  }

  return (
    <>
      <AntHeader
        style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}
      >
        {/* 左侧：折叠按钮 */}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapsed}
          style={{ fontSize: '16px', width: 48, height: 48 }}
        />

        {/* 右侧：环境切换 */}
        <Space size="middle">
          {/* 环境状态显示 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 16px',
              borderRadius: '20px',
              background: isPublic ? '#e6f7ff' : '#f6ffed',
              border: `1px solid ${isPublic ? '#91d5ff' : '#b7eb8f'}`
            }}
          >
            {isPublic ? (
              <GlobalOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            ) : (
              <LockOutlined style={{ color: '#52c41a', marginRight: 8 }} />
            )}
            <Text strong style={{ color: isPublic ? '#1890ff' : '#52c41a' }}>
              {isPublic ? '公网环境' : '私域环境'}
            </Text>
          </div>

          {/* 环境切换开关 */}
          <Tooltip title={isPublic ? '切换到私域环境' : '切换到公网环境'}>
            <Switch
              checked={isPublic}
              onChange={handleEnvironmentChange}
              checkedChildren="公网"
              unCheckedChildren="私域"
              style={{
                backgroundColor: isPublic ? '#1890ff' : '#52c41a'
              }}
            />
          </Tooltip>
        </Space>
      </AntHeader>

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
        <ul>
          <li>公网环境下的数据可能通过互联网传输</li>
          <li>请勿在公网环境下处理涉密文档</li>
          <li>AI 服务将使用云端 API</li>
        </ul>
        <p>确定要切换吗？</p>
      </Modal>
    </>
  )
}
