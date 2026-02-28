/**
 * 文档列表面板组件
 * 用于侧边栏显示文档列表
 */

import { useState } from 'react'
import { Input, Button, List, Tag, Empty, Dropdown, Tooltip } from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  FileTextOutlined,
  CloudOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
  StarFilled,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined
} from '@ant-design/icons'

interface Document {
  id: string
  title: string
  type: string
  environment: 'public' | 'private'
  wordCount: number
  updatedAt: string
  isFavorite: boolean
}

interface DocumentListPanelProps {
  documents?: Document[]
  onDocumentClick?: (id: string) => void
  onNewDocument?: () => void
  onFavorite?: (id: string) => void
  onDelete?: (id: string) => void
}

// 文档类型标签配置
const documentTypes = [
  { key: 'all', label: '全部' },
  { key: 'notice', label: '通知' },
  { key: 'report', label: '报告' },
  { key: 'request', label: '请示' },
  { key: 'reply', label: '批复' },
  { key: 'letter', label: '函' },
  { key: 'other', label: '其他' }
]

export default function DocumentListPanel({
  documents = [],
  onDocumentClick,
  onNewDocument,
  onFavorite,
  onDelete
}: DocumentListPanelProps) {
  const [searchValue, setSearchValue] = useState('')
  const [activeType, setActiveType] = useState('all')

  // 过滤文档
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchValue.toLowerCase())
    const matchesType = activeType === 'all' || doc.type === activeType
    return matchesSearch && matchesType
  })

  const getDropdownItems = (doc: Document) => [
    {
      key: 'edit',
      label: '编辑',
      icon: <EditOutlined />
    },
    {
      key: 'copy',
      label: '复制',
      icon: <CopyOutlined />
    },
    {
      key: 'favorite',
      label: doc.isFavorite ? '取消收藏' : '收藏',
      icon: doc.isFavorite ? <StarFilled /> : <StarOutlined />
    },
    {
      type: 'divider' as const
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true
    }
  ]

  return (
    <div className="document-list-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 搜索和新建 */}
      <div style={{ padding: 'var(--spacing-md)' }}>
        <Input
          placeholder="搜索文档..."
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          allowClear
          style={{ marginBottom: 'var(--spacing-sm)' }}
        />
        <Button type="primary" icon={<PlusOutlined />} block onClick={onNewDocument}>
          新建文档
        </Button>
      </div>

      {/* 类型筛选 */}
      <div style={{ 
        padding: '0 var(--spacing-md) var(--spacing-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-xs)'
      }}>
        {documentTypes.map(type => (
          <Tag
            key={type.key}
            style={{ 
              cursor: 'pointer',
              borderColor: activeType === type.key ? 'var(--theme-color)' : undefined,
              color: activeType === type.key ? 'var(--theme-color)' : undefined
            }}
            onClick={() => setActiveType(type.key)}
          >
            {type.label}
          </Tag>
        ))}
      </div>

      {/* 文档列表 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 var(--spacing-md)' }}>
        {filteredDocuments.length > 0 ? (
          <List
            dataSource={filteredDocuments}
            renderItem={doc => (
              <List.Item
                style={{ 
                  padding: 'var(--spacing-sm)',
                  cursor: 'pointer',
                  borderRadius: 'var(--border-radius-base)'
                }}
                onClick={() => onDocumentClick?.(doc.id)}
                actions={[
                  <Tooltip key="favorite" title={doc.isFavorite ? '取消收藏' : '收藏'}>
                    <Button
                      type="text"
                      size="small"
                      icon={doc.isFavorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                      onClick={(e) => {
                        e.stopPropagation()
                        onFavorite?.(doc.id)
                      }}
                    />
                  </Tooltip>,
                  <Dropdown
                    key="more"
                    menu={{
                      items: getDropdownItems(doc),
                      onClick: ({ key }) => {
                        if (key === 'delete') onDelete?.(doc.id)
                        if (key === 'favorite') onFavorite?.(doc.id)
                      }
                    }}
                    trigger={['click']}
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<MoreOutlined />}
                      onClick={e => e.stopPropagation()}
                    />
                  </Dropdown>
                ]}
              >
                <List.Item.Meta
                  avatar={<FileTextOutlined style={{ fontSize: 20, color: 'var(--theme-color)' }} />}
                  title={
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--spacing-xs)',
                      fontSize: 'var(--font-size-base)'
                    }}>
                      {doc.title}
                    </div>
                  }
                  description={
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--spacing-sm)',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      <span>{doc.type}</span>
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        color: doc.environment === 'public' ? 'var(--color-public-primary)' : 'var(--color-private-primary)'
                      }}>
                        {doc.environment === 'public' ? <CloudOutlined /> : <SafetyCertificateOutlined />}
                        {doc.environment === 'public' ? '公网' : '私域'}
                      </span>
                      <span>{doc.wordCount}字</span>
                      <span>{doc.updatedAt}</span>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={searchValue ? '未找到匹配的文档' : '暂无文档'}
          >
            {!searchValue && (
              <Button type="primary" onClick={onNewDocument}>
                创建第一份文档
              </Button>
            )}
          </Empty>
        )}
      </div>
    </div>
  )
}
