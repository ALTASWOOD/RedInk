/**
 * 侧边栏组件
 * 根据活动栏选择动态显示内容
 */

import { Input, Button, Tooltip } from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  LeftOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  StarOutlined,
  InboxOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { ActivityType } from './ActivityBar'

interface SidebarProps {
  activeActivity: ActivityType
  collapsed: boolean
  onCollapse: () => void
}

// 侧边栏标题配置
const sidebarTitles: Record<Exclude<ActivityType, 'settings'>, { title: string; icon: React.ReactNode }> = {
  documents: { title: '我的文档', icon: <FileTextOutlined /> },
  templates: { title: '模板库', icon: <AppstoreOutlined /> },
  recent: { title: '最近使用', icon: <ClockCircleOutlined /> },
  favorites: { title: '收藏', icon: <StarOutlined /> },
  materials: { title: '素材库', icon: <InboxOutlined /> },
  charts: { title: '图表', icon: <BarChartOutlined /> }
}

export default function Sidebar({ activeActivity, collapsed, onCollapse }: SidebarProps) {
  if (activeActivity === 'settings') return null

  const config = sidebarTitles[activeActivity]

  const renderContent = () => {
    switch (activeActivity) {
      case 'documents':
        return <DocumentsContent />
      case 'templates':
        return <TemplatesContent />
      case 'recent':
        return <RecentContent />
      case 'favorites':
        return <FavoritesContent />
      case 'materials':
        return <MaterialsContent />
      case 'charts':
        return <ChartsContent />
      default:
        return null
    }
  }

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {!collapsed && (
        <>
          {/* 侧边栏头部 */}
          <div className="sidebar-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {config.icon}
              {config.title}
            </h3>
            <Tooltip title="折叠">
              <Button
                type="text"
                size="small"
                icon={<LeftOutlined />}
                onClick={onCollapse}
              />
            </Tooltip>
          </div>

          {/* 侧边栏内容 */}
          <div className="sidebar-content">
            {renderContent()}
          </div>
        </>
      )}
    </div>
  )
}

// 文档列表内容
function DocumentsContent() {
  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      <Input
        placeholder="搜索文档..."
        prefix={<SearchOutlined />}
        style={{ marginBottom: 'var(--spacing-md)' }}
      />
      <Button type="primary" icon={<PlusOutlined />} block>
        新建文档
      </Button>
      
      <div style={{ marginTop: 'var(--spacing-md)' }}>
        <div style={{ 
          fontSize: 'var(--font-size-sm)', 
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-sm)'
        }}>
          全部 | 通知 | 报告 | 请示 | 其他
        </div>
        
        {/* 文档列表占位 */}
        <div style={{ 
          padding: 'var(--spacing-xl)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)'
        }}>
          暂无文档
        </div>
      </div>
    </div>
  )
}

// 模板库内容
function TemplatesContent() {
  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      <Input
        placeholder="搜索模板..."
        prefix={<SearchOutlined />}
        style={{ marginBottom: 'var(--spacing-md)' }}
      />
      
      <div style={{ 
        fontSize: 'var(--font-size-sm)', 
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--spacing-sm)'
      }}>
        全部 | 通知 | 报告 | 请示 | 批复 | 函
      </div>
      
      {/* 模板列表占位 */}
      <div style={{ 
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        color: 'var(--color-text-secondary)'
      }}>
        内置模板加载中...
      </div>
    </div>
  )
}

// 最近使用内容
function RecentContent() {
  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      <div style={{ 
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        color: 'var(--color-text-secondary)'
      }}>
        暂无最近使用的文档
      </div>
    </div>
  )
}

// 收藏内容
function FavoritesContent() {
  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      <div style={{ 
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        color: 'var(--color-text-secondary)'
      }}>
        暂无收藏的文档
      </div>
    </div>
  )
}

// 素材库内容
function MaterialsContent() {
  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      <div style={{ 
        fontSize: 'var(--font-size-sm)', 
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--spacing-md)',
        display: 'flex',
        gap: 'var(--spacing-sm)'
      }}>
        <span style={{ cursor: 'pointer', color: 'var(--theme-color)' }}>常用短语</span>
        <span style={{ cursor: 'pointer' }}>段落模板</span>
        <span style={{ cursor: 'pointer' }}>图片素材</span>
      </div>
      
      <Input
        placeholder="搜索素材..."
        prefix={<SearchOutlined />}
        style={{ marginBottom: 'var(--spacing-md)' }}
      />
      
      <div style={{ 
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        color: 'var(--color-text-secondary)'
      }}>
        暂无素材
      </div>
    </div>
  )
}

// 图表内容
function ChartsContent() {
  return (
    <div style={{ padding: 'var(--spacing-md)' }}>
      <Button type="primary" icon={<PlusOutlined />} block>
        新建图表
      </Button>
      
      <div style={{ 
        marginTop: 'var(--spacing-md)',
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        color: 'var(--color-text-secondary)'
      }}>
        图表功能开发中...
      </div>
    </div>
  )
}
