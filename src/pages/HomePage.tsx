/**
 * 首页
 */

import { Card, Row, Col, Button, Typography, Space, Statistic } from 'antd'
import {
  FileAddOutlined,
  FolderOpenOutlined,
  AppstoreOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useEnvStore } from '@stores/envStore'

const { Title, Paragraph } = Typography

export default function HomePage() {
  const navigate = useNavigate()
  const { environment } = useEnvStore()
  
  const isPublic = environment === 'public'
  const primaryColor = isPublic ? '#1890ff' : '#52c41a'

  const quickActions = [
    {
      title: '新建公文',
      icon: <FileAddOutlined style={{ fontSize: 32, color: primaryColor }} />,
      description: '创建新的公文文档',
      onClick: () => navigate('/document')
    },
    {
      title: '打开文档',
      icon: <FolderOpenOutlined style={{ fontSize: 32, color: primaryColor }} />,
      description: '打开已有的文档',
      onClick: () => navigate('/documents')
    },
    {
      title: '模板库',
      icon: <AppstoreOutlined style={{ fontSize: 32, color: primaryColor }} />,
      description: '浏览公文模板',
      onClick: () => navigate('/templates')
    }
  ]

  return (
    <div>
      {/* 欢迎区域 */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>欢迎使用 RedInk</Title>
        <Paragraph type="secondary">
          AI 驱动的公文报告编写软件，助您高效完成公文写作
        </Paragraph>
        <Space>
          <Button
            type="primary"
            icon={<FileAddOutlined />}
            size="large"
            onClick={() => navigate('/document')}
            style={{ backgroundColor: primaryColor }}
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
      </Card>

      {/* 快捷操作 */}
      <Title level={4}>快捷操作</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {quickActions.map((action, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              onClick={action.onClick}
              style={{ textAlign: 'center', cursor: 'pointer' }}
            >
              <div style={{ marginBottom: 16 }}>{action.icon}</div>
              <Title level={5}>{action.title}</Title>
              <Paragraph type="secondary">{action.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 统计信息 */}
      <Title level={4}>工作统计</Title>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="本周新建"
              value={0}
              prefix={<FileTextOutlined />}
              suffix="篇"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="草稿文档"
              value={0}
              prefix={<FileTextOutlined />}
              suffix="篇"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={0}
              prefix={<FileTextOutlined />}
              suffix="篇"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="AI 辅助次数"
              value={0}
              suffix="次"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
