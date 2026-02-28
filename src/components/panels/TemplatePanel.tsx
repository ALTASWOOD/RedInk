/**
 * 模板库面板组件
 * 用于侧边栏显示模板列表
 */

import { useState } from 'react'
import { Input, Card, Tag, Empty, Row, Col, Tooltip, Button } from 'antd'
import {
  SearchOutlined,
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'

interface Template {
  id: string
  name: string
  type: string
  description: string
  usageCount: number
  isBuiltin: boolean
}

interface TemplatePanelProps {
  templates?: Template[]
  onTemplateSelect?: (id: string) => void
  onCreateTemplate?: () => void
  onEditTemplate?: (id: string) => void
  onDeleteTemplate?: (id: string) => void
}

// 模板类型
const templateTypes = [
  { key: 'all', label: '全部' },
  { key: 'notice', label: '通知' },
  { key: 'report', label: '报告' },
  { key: 'request', label: '请示' },
  { key: 'reply', label: '批复' },
  { key: 'letter', label: '函' },
  { key: 'minutes', label: '会议纪要' },
  { key: 'custom', label: '自定义' }
]

// 内置模板数据
const builtinTemplates: Template[] = [
  { id: 't1', name: '通知模板', type: 'notice', description: '适用于各类工作通知', usageCount: 156, isBuiltin: true },
  { id: 't2', name: '报告模板', type: 'report', description: '适用于工作汇报、总结', usageCount: 98, isBuiltin: true },
  { id: 't3', name: '请示模板', type: 'request', description: '适用于向上级请示事项', usageCount: 67, isBuiltin: true },
  { id: 't4', name: '批复模板', type: 'reply', description: '适用于对下级请示的答复', usageCount: 45, isBuiltin: true },
  { id: 't5', name: '函件模板', type: 'letter', description: '适用于平级单位往来', usageCount: 78, isBuiltin: true },
  { id: 't6', name: '会议纪要模板', type: 'minutes', description: '适用于会议记录整理', usageCount: 112, isBuiltin: true }
]

export default function TemplatePanel({
  templates = [],
  onTemplateSelect,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate
}: TemplatePanelProps) {
  const [searchValue, setSearchValue] = useState('')
  const [activeType, setActiveType] = useState('all')

  const allTemplates = [...builtinTemplates, ...templates]

  // 过滤模板
  const filteredTemplates = allTemplates.filter(tpl => {
    const matchesSearch = tpl.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchValue.toLowerCase())
    const matchesType = activeType === 'all' || tpl.type === activeType ||
      (activeType === 'custom' && !tpl.isBuiltin)
    return matchesSearch && matchesType
  })

  const builtinFiltered = filteredTemplates.filter(t => t.isBuiltin)
  const customFiltered = filteredTemplates.filter(t => !t.isBuiltin)

  return (
    <div className="template-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 搜索 */}
      <div style={{ padding: 'var(--spacing-md)' }}>
        <Input
          placeholder="搜索模板..."
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          allowClear
        />
      </div>

      {/* 类型筛选 */}
      <div style={{ 
        padding: '0 var(--spacing-md) var(--spacing-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-xs)'
      }}>
        {templateTypes.map(type => (
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

      {/* 模板列表 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 var(--spacing-md)' }}>
        {filteredTemplates.length > 0 ? (
          <>
            {/* 内置模板 */}
            {builtinFiltered.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{ 
                  fontSize: 'var(--font-size-sm)', 
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  内置模板
                </div>
                <Row gutter={[8, 8]}>
                  {builtinFiltered.map(tpl => (
                    <Col span={24} key={tpl.id}>
                      <Card
                        size="small"
                        hoverable
                        style={{ cursor: 'pointer' }}
                        onClick={() => onTemplateSelect?.(tpl.id)}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
                          <FileTextOutlined style={{ fontSize: 24, color: 'var(--theme-color)', marginTop: 2 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{tpl.name}</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                              {tpl.description}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-disabled)', marginTop: 4 }}>
                              使用 {tpl.usageCount} 次
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* 自定义模板 */}
            {customFiltered.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{ 
                  fontSize: 'var(--font-size-sm)', 
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>我的模板</span>
                  <Button type="link" size="small" icon={<PlusOutlined />} onClick={onCreateTemplate}>
                    新建
                  </Button>
                </div>
                <Row gutter={[8, 8]}>
                  {customFiltered.map(tpl => (
                    <Col span={24} key={tpl.id}>
                      <Card
                        size="small"
                        hoverable
                        style={{ cursor: 'pointer' }}
                        onClick={() => onTemplateSelect?.(tpl.id)}
                        actions={[
                          <Tooltip key="edit" title="编辑">
                            <EditOutlined onClick={e => { e.stopPropagation(); onEditTemplate?.(tpl.id) }} />
                          </Tooltip>,
                          <Tooltip key="delete" title="删除">
                            <DeleteOutlined onClick={e => { e.stopPropagation(); onDeleteTemplate?.(tpl.id) }} />
                          </Tooltip>
                        ]}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
                          <FileTextOutlined style={{ fontSize: 24, color: 'var(--color-warning)', marginTop: 2 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{tpl.name}</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                              {tpl.description}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={searchValue ? '未找到匹配的模板' : '暂无模板'}
          />
        )}

        {/* 创建自定义模板按钮 */}
        {activeType !== 'all' && customFiltered.length === 0 && !searchValue && (
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
            <Button type="dashed" icon={<PlusOutlined />} onClick={onCreateTemplate}>
              创建自定义模板
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
