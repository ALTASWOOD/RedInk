/**
 * 侧边栏组件
 */

import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  HomeOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  SettingOutlined
} from '@ant-design/icons'
import { useEnvStore } from '@stores/envStore'

const { Sider } = Layout

interface SidebarProps {
  collapsed: boolean
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { environment } = useEnvStore()

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: '/documents',
      icon: <FileTextOutlined />,
      label: '我的文档'
    },
    {
      key: '/templates',
      icon: <AppstoreOutlined />,
      label: '模板库'
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置'
    }
  ]

  // 根据环境设置主题色
  const siderBgColor = environment === 'public' ? '#001529' : '#00352b'

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{ background: siderBgColor }}
    >
      {/* Logo */}
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: collapsed ? '18px' : '20px',
          fontWeight: 'bold',
          background: 'rgba(255,255,255,0.1)'
        }}
      >
        {collapsed ? 'RI' : 'RedInk'}
      </div>
      
      {/* 导航菜单 */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ background: 'transparent' }}
      />
    </Sider>
  )
}
