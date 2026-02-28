/**
 * 模板管理页
 */

import { Card, Row, Col, Typography, Empty, Tag } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph } = Typography

// 内置模板数据（后续从数据库加载）
const builtinTemplates = [
  {
    id: 'notice',
    name: '通知',
    description: '用于发布公告、通知事项',
    tags: ['常用', '通知类']
  },
  {
    id: 'report',
    name: '工作报告',
    description: '用于汇报工作进展、成果',
    tags: ['常用', '报告类']
  },
  {
    id: 'request',
    name: '请示',
    description: '用于向上级请示事项',
    tags: ['常用', '请示类']
  },
  {
    id: 'reply',
    name: '批复',
    description: '用于回复下级请示',
    tags: ['批复类']
  },
  {
    id: 'meeting',
    name: '会议纪要',
    description: '用于记录会议内容和决议',
    tags: ['常用', '会议类']
  },
  {
    id: 'letter',
    name: '函',
    description: '用于平级单位之间的公文往来',
    tags: ['函件类']
  }
]

export default function TemplatePage() {
  const navigate = useNavigate()

  const handleSelectTemplate = (templateId: string) => {
    // 使用模板创建新文档
    navigate(`/document?template=${templateId}`)
  }

  return (
    <div>
      <Title level={4}>公文模板库</Title>
      <Paragraph type="secondary">
        选择一个模板开始创建公文文档
      </Paragraph>

      {builtinTemplates.length > 0 ? (
        <Row gutter={[16, 16]}>
          {builtinTemplates.map((template) => (
            <Col span={8} key={template.id}>
              <Card
                hoverable
                onClick={() => handleSelectTemplate(template.id)}
                style={{ height: '100%' }}
              >
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <FileTextOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                </div>
                <Title level={5} style={{ textAlign: 'center' }}>
                  {template.name}
                </Title>
                <Paragraph
                  type="secondary"
                  style={{ textAlign: 'center', marginBottom: 12 }}
                >
                  {template.description}
                </Paragraph>
                <div style={{ textAlign: 'center' }}>
                  {template.tags.map((tag) => (
                    <Tag key={tag} color="blue" style={{ marginBottom: 4 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="暂无模板" />
      )}
    </div>
  )
}
