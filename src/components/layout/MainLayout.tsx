/**
 * 主布局组件
 * 实现五栏布局：活动栏 + 侧边栏 + 主内容区 + AI面板
 * 以及自定义标题栏、顶部环境状态栏和底部状态栏
 */

import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import TitleBar from './TitleBar'
import Header from './Header'
import ActivityBar, { ActivityType } from './ActivityBar'
import Sidebar from './Sidebar'
import AIPanel from './AIPanel'
import StatusBar from './StatusBar'

export default function MainLayout() {
  const navigate = useNavigate()
  const [activeActivity, setActiveActivity] = useState<ActivityType>('documents')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [aiPanelVisible, setAiPanelVisible] = useState(true)

  // 处理活动栏切换
  const handleActivityChange = (key: ActivityType) => {
    if (key === 'settings') {
      navigate('/settings')
      return
    }
    
    if (activeActivity === key) {
      // 再次点击相同项，折叠/展开侧边栏
      setSidebarCollapsed(!sidebarCollapsed)
    } else {
      setActiveActivity(key)
      setSidebarCollapsed(false)
    }
  }

  return (
    <div className="app-layout" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* 自定义标题栏（替代原生标题栏） */}
      <TitleBar />

      {/* 顶部环境状态栏 */}
      <Header />

      {/* 主体区域 */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        overflow: 'hidden' 
      }}>
        {/* 活动栏 */}
        <ActivityBar 
          activeKey={activeActivity} 
          onActivityChange={handleActivityChange} 
        />

        {/* 侧边栏 */}
        <Sidebar 
          activeActivity={activeActivity}
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* 主内容区 */}
        <div className="main-content">
          <div className="content-area">
            <Outlet />
          </div>
        </div>

        {/* AI 助手面板 */}
        <AIPanel 
          visible={aiPanelVisible}
          onMinimize={() => setAiPanelVisible(false)}
          aiStatus="idle"
          aiModel="Ollama"
        />
      </div>

      {/* 底部状态栏 */}
      <StatusBar 
        wordCount={0}
        savedTime={undefined}
        currentPage={1}
        totalPages={1}
        aiStatus="idle"
        aiModel="Ollama"
      />
    </div>
  )
}
