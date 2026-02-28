/**
 * 活动栏组件 - 主界面最左侧的垂直图标栏
 * 用于快速切换功能面板
 */

import { Tooltip } from 'antd'
import {
  FileTextOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  StarOutlined,
  InboxOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons'

export type ActivityType =
  | 'documents'
  | 'templates'
  | 'recent'
  | 'favorites'
  | 'materials'
  | 'charts'
  | 'settings'

interface ActivityBarProps {
  activeKey: ActivityType
  onActivityChange: (key: ActivityType) => void
}

interface ActivityItem {
  key: ActivityType
  icon: React.ReactNode
  label: string
  position: 'top' | 'bottom'
}

const activityItems: ActivityItem[] = [
  { key: 'documents', icon: <FileTextOutlined />, label: '我的文档', position: 'top' },
  { key: 'templates', icon: <AppstoreOutlined />, label: '模板库', position: 'top' },
  { key: 'recent', icon: <ClockCircleOutlined />, label: '最近使用', position: 'top' },
  { key: 'favorites', icon: <StarOutlined />, label: '收藏', position: 'top' },
  { key: 'materials', icon: <InboxOutlined />, label: '素材库', position: 'top' },
  { key: 'charts', icon: <BarChartOutlined />, label: '图表', position: 'top' },
  { key: 'settings', icon: <SettingOutlined />, label: '设置', position: 'bottom' }
]

export default function ActivityBar({ activeKey, onActivityChange }: ActivityBarProps) {
  const topItems = activityItems.filter((item) => item.position === 'top')
  const bottomItems = activityItems.filter((item) => item.position === 'bottom')

  const renderItem = (item: ActivityItem) => (
    <Tooltip key={item.key} title={item.label} placement="right" mouseEnterDelay={0.5}>
      <div
        className={`activity-bar-item ${activeKey === item.key ? 'active' : ''}`}
        onClick={() => onActivityChange(item.key)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onActivityChange(item.key)
          }
        }}
      >
        {item.icon}
      </div>
    </Tooltip>
  )

  return (
    <div className="activity-bar">
      <div className="activity-bar-top">{topItems.map(renderItem)}</div>
      <div className="activity-bar-bottom">{bottomItems.map(renderItem)}</div>
    </div>
  )
}
