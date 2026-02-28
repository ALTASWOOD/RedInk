/**
 * 首页
 * 显示欢迎信息、快速操作、最近文档和统计数据
 */

import { Card, Row, Col, Button, Typography, Space, Statistic, List, Tag, Empty } from 'antd'
import {
  FileAddOutlined,
  FolderOpenOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  CloudOutlined,
  SafetyCertificateOutlined,
  RobotOutlined,
  EditOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useEnvStore } from '@stores/envStore'

const { Title, Paragraph, Text } = Typography

// 模拟最近文档数据
const recentDocuments = [
  { id: '1', title: '关于召开年度工作总结会议的通知', type: '通知', environment: 'private', updatedAt: '2小时前' },
  { id: '2', title: '2026年第一季度工作报告', type: '报告', environment: 'private', updatedAt: '昨天' },
  { id: '3', title: '关于增加预算的请示', type: '请示', environment: 'public', updatedAt: '3天前' }
]

export default function HomePage() {
  const navigate = useNavigate()
  const { environment } = useEnvStore()
  
  const isPublic = environment === 'public'
  const primaryColor = isPublic ? '#1890ff' : '#52c41a'

  const quickActions = [
    {
      title: '新建公文',
      icon: <FileAddOutlined style={{ fontSize: 28, color: primaryColor }} />,
      description: '创建新的公文文档',
      onClick: () => navigate('/document')
    },
    {
      title: '打开文档',
      icon: <FolderOpenOutlined style={{ fontSize: 28, color: primaryColor }} />,
      description: '打开已有的文档',
      onClick: () => navigate('/documents')
    },
    {
      title: '模板库',
      icon: <AppstoreOutlined style={{ fontSize: 28, color: primaryColor }} />,
      description: '浏览公文模板',
      onClick: () => navigate('/templates')
    },
    {
      title: 'AI 辅助',
      icon: <RobotOutlined style={{ fontSize: 28, color: primaryColor }} />,
      description: '使用 AI 生成内容',
      onClick: () => navigate('/document')
    }
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* 欢迎区域 */}
      <Card 
        style={{ 
          marginBottom: 'var(--spacing-lg)',
          background: `linear-gradient(135deg, ${isPublic ? '#e6f7ff' : '#f6ffed'} 0%, white 100%)`,
          border: `1px solid ${isPublic ? '#91d5ff' : '#b7eb8f'}`
        }}
      >
        <Row align="middle" gutter={24}>
          <Col flex="1">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
              {isPublic ? (
                <CloudOutlined style={{ fontSize: 24, color: primaryColor }} />
              ) : (
                <SafetyCertificateOutlined style={{ fontSize: 24, color: primaryColor }} />
              )}
              <Tag color={isPublic ? 'blue' : 'green'}>
                {isPublic ? '公网环境' : '私域环境'}
              </Tag>
            </div>
            <Title level={3} style={{ marginBottom: 'var(--spacing-sm)' }}>欢迎使用 RedInk</Title>
            <Paragraph type="secondary" style={{ marginBottom: 'var(--spacing-md)' }}>
              AI 驱动的公文报告编写软件，助您高效完成公文写作。
              {!isPublic && '当前处于私域环境，数据将在本地安全处理。'}
            </Paragraph>
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="large"
                onClick={() => navigate('/document')}
                style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
              >
                开始写作
              </Button>
              <Button
                icon={<AppstoreOutlined />}
                size="large"
                onClick={() => navigate('/templates')}
              >
                选择模板
              </Button>
            </Space>
          </Col>
          <Col>
            <div style={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}40 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ThunderboltOutlined style={{ fontSize: 48, color: primaryColor }} />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 快捷操作 */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <Title level={5} style={{ marginBottom: 'var(--spacing-md)' }}>
          <ThunderboltOutlined style={{ marginRight: 8 }} />
          快捷操作
        </Title>
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col span={6} key={index}>
              <Card
                hoverable
                onClick={action.onClick}
                style={{ textAlign: 'center', cursor: 'pointer' }}
                bodyStyle={{ padding: 'var(--spacing-md)' }}
              >
                <div style={{ marginBottom: 'var(--spacing-sm)' }}>{action.icon}</div>
                <Text strong>{action.title}</Text>
                <Paragraph type="secondary" style={{ fontSize: 'var(--font-size-sm)', marginBottom: 0, marginTop: 4 }}>
                  {action.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Row gutter={24}>
        {/* 最近文档 */}
        <Col span={14}>
          <Card 
            title={
              <span>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                最近文档
              </span>
            }
            extra={<Button type="link" onClick={() => navigate('/documents')}>查看全部</Button>}
            style={{ marginBottom: 'var(--spacing-lg)' }}
          >
            {recentDocuments.length > 0 ? (
              <List
                dataSource={recentDocuments}
                renderItem={doc => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/document/${doc.id}`)}
                    actions={[
                      <Button key="edit" type="link" size="small">编辑</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<FileTextOutlined style={{ fontSize: 20, color: 'var(--theme-color)' }} />}
                      title={doc.title}
                      description={
                        <Space size="small">
                          <Tag>{doc.type}</Tag>
                          <span style={{ 
                            color: doc.environment === 'public' ? 'var(--color-public-primary)' : 'var(--color-private-primary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}>
                            {doc.environment === 'public' ? <CloudOutlined /> : <SafetyCertificateOutlined />}
                            {doc.environment === 'public' ? '公网' : '私域'}
                          </span>
                          <Text type="secondary">{doc.updatedAt}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无最近文档" />
            )}
          </Card>
        </Col>

        {/* 统计信息 */}
        <Col span={10}>
          <Card 
            title={
              <span>
                <FileTextOutlined style={{ marginRight: 8 }} />
                工作统计
              </span>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="本周新建"
                  value={0}
                  suffix="篇"
                  valueStyle={{ color: primaryColor }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="草稿文档"
                  value={0}
                  suffix="篇"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="已完成"
                  value={0}
                  suffix="篇"
                  valueStyle={{ color: 'var(--color-success)' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="AI 辅助"
                  value={0}
                  suffix="次"
                />
              </Col>
            </Row>
          </Card>

          {/* AI 状态卡片 */}
          <Card 
            style={{ marginTop: 'var(--spacing-md)' }}
            bodyStyle={{ padding: 'var(--spacing-md)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <RobotOutlined style={{ fontSize: 24, color: primaryColor }} />
              <div>
                <Text strong>AI 助手</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                  {isPublic ? '云端 API 可用' : 'Ollama 本地模型'}
                </Text>
              </div>
              <Button type="link" style={{ marginLeft: 'auto' }} onClick={() => navigate('/settings')}>
                配置
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
