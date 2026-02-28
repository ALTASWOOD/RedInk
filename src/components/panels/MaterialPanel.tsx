/**
 * 素材库面板组件
 * 用于管理常用短语、段落模板、图片素材等
 */

import { useState } from 'react'
import { Input, Tabs, Tree, List, Button, Empty, Tooltip, message } from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  CopyOutlined
} from '@ant-design/icons'

type MaterialType = 'phrases' | 'paragraphs' | 'images' | 'tables' | 'favorites'

interface MaterialItem {
  id: string
  title: string
  content: string
  category: string
  usageCount: number
}

interface MaterialCategory {
  key: string
  title: string
  children?: MaterialCategory[]
}

interface MaterialPanelProps {
  onInsert?: (content: string) => void
  onEdit?: (id: string) => void
}

// 短语分类
const phraseCategories: MaterialCategory[] = [
  {
    key: 'opening',
    title: '开头语',
    children: [
      { key: 'opening-1', title: '为进一步...' },
      { key: 'opening-2', title: '根据...要求' },
      { key: 'opening-3', title: '为贯彻落实...' }
    ]
  },
  {
    key: 'closing',
    title: '结束语',
    children: [
      { key: 'closing-1', title: '特此通知' },
      { key: 'closing-2', title: '请予批准' },
      { key: 'closing-3', title: '妥否请批示' }
    ]
  },
  {
    key: 'transition',
    title: '过渡语'
  },
  {
    key: 'request',
    title: '请示用语'
  },
  {
    key: 'reply',
    title: '批复用语'
  }
]

// 示例短语数据
const samplePhrases: MaterialItem[] = [
  { id: 'p1', title: '为进一步...', content: '为进一步加强和改进我单位工作，根据上级部门要求，现就有关事项通知如下：', category: '开头语', usageCount: 56 },
  { id: 'p2', title: '根据...要求', content: '根据《关于...的通知》要求，结合我单位实际情况，', category: '开头语', usageCount: 42 },
  { id: 'p3', title: '为贯彻落实...', content: '为贯彻落实党中央、国务院关于...的决策部署，', category: '开头语', usageCount: 38 },
  { id: 'p4', title: '特此通知', content: '特此通知。', category: '结束语', usageCount: 89 },
  { id: 'p5', title: '请予批准', content: '以上请示，请予批准。', category: '结束语', usageCount: 45 },
  { id: 'p6', title: '妥否请批示', content: '以上意见如无不妥，请批转各地区、各部门执行。', category: '结束语', usageCount: 32 }
]

export default function MaterialPanel({
  onInsert,
  onEdit
}: MaterialPanelProps) {
  const [activeTab, setActiveTab] = useState<MaterialType>('phrases')
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // 过滤素材
  const filteredPhrases = samplePhrases.filter(item => {
    const matchesSearch = item.title.includes(searchValue) || item.content.includes(searchValue)
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    message.success('已复制到剪贴板')
  }

  const handleInsert = (content: string) => {
    onInsert?.(content)
    message.success('已插入')
  }

  const renderPhrases = () => (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* 分类树 */}
      <div style={{ 
        width: 140, 
        borderRight: '1px solid var(--color-border-light)',
        overflow: 'auto',
        padding: 'var(--spacing-sm)'
      }}>
        <Tree
          treeData={phraseCategories}
          defaultExpandAll
          selectedKeys={selectedCategory ? [selectedCategory] : []}
          onSelect={(keys) => setSelectedCategory(keys[0] as string || null)}
          style={{ fontSize: 'var(--font-size-sm)' }}
        />
        <Button 
          type="link" 
          size="small" 
          icon={<PlusOutlined />} 
          style={{ marginTop: 'var(--spacing-sm)' }}
        >
          新建分类
        </Button>
      </div>

      {/* 素材列表 */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {filteredPhrases.length > 0 ? (
          <List
            dataSource={filteredPhrases}
            renderItem={item => (
              <List.Item
                style={{ padding: 'var(--spacing-sm) var(--spacing-md)' }}
                actions={[
                  <Tooltip key="insert" title="插入">
                    <Button size="small" type="primary" onClick={() => handleInsert(item.content)}>
                      插入
                    </Button>
                  </Tooltip>,
                  <Tooltip key="copy" title="复制">
                    <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(item.content)} />
                  </Tooltip>,
                  <Tooltip key="edit" title="编辑">
                    <Button size="small" icon={<EditOutlined />} onClick={() => onEdit?.(item.id)} />
                  </Tooltip>
                ]}
              >
                <List.Item.Meta
                  title={
                    <div style={{ fontSize: 'var(--font-size-base)' }}>{item.title}</div>
                  }
                  description={
                    <div>
                      <div style={{ 
                        fontSize: 'var(--font-size-sm)', 
                        color: 'var(--color-text-secondary)',
                        marginBottom: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 200
                      }}>
                        {item.content}
                      </div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-disabled)' }}>
                        分类: {item.category} | 使用: {item.usageCount}次
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无素材" style={{ marginTop: 'var(--spacing-xl)' }} />
        )}
      </div>
    </div>
  )

  const renderEmptyContent = (text: string) => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100%',
      padding: 'var(--spacing-xl)'
    }}>
      <Empty description={text} />
      <Button type="primary" icon={<PlusOutlined />} style={{ marginTop: 'var(--spacing-md)' }}>
        添加素材
      </Button>
    </div>
  )

  const tabItems = [
    { key: 'phrases', label: '常用短语', children: renderPhrases() },
    { key: 'paragraphs', label: '段落模板', children: renderEmptyContent('段落模板功能开发中...') },
    { key: 'images', label: '图片素材', children: renderEmptyContent('图片素材功能开发中...') },
    { key: 'tables', label: '表格模板', children: renderEmptyContent('表格模板功能开发中...') },
    { key: 'favorites', label: '收藏', children: renderEmptyContent('暂无收藏的素材') }
  ]

  return (
    <div className="material-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 搜索 */}
      <div style={{ padding: 'var(--spacing-md)' }}>
        <Input
          placeholder="搜索素材..."
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          allowClear
        />
      </div>

      {/* 标签页 */}
      <Tabs
        activeKey={activeTab}
        onChange={key => setActiveTab(key as MaterialType)}
        items={tabItems}
        size="small"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        tabBarStyle={{ padding: '0 var(--spacing-md)', marginBottom: 0 }}
      />

      {/* 底部操作 */}
      <div style={{ 
        padding: 'var(--spacing-sm) var(--spacing-md)',
        borderTop: '1px solid var(--color-border-light)',
        display: 'flex',
        gap: 'var(--spacing-sm)'
      }}>
        <Button size="small" icon={<PlusOutlined />}>新建短语</Button>
        <Button size="small">导入</Button>
        <Button size="small">导出</Button>
      </div>
    </div>
  )
}
