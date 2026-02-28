/**
 * 主布局组件
 */

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Sidebar from './Sidebar'
import Header from './Header'

const { Content } = Layout

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header collapsed={collapsed} onToggleCollapsed={() => setCollapsed(!collapsed)} />
        <Content
          style={{
            margin: '16px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
