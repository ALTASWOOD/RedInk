/**
 * 文档编辑页
 */

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Input, Button, Space, Typography, Divider, message } from 'antd'
import { SaveOutlined, RobotOutlined, ExportOutlined } from '@ant-design/icons'
import { useEnvStore } from '@stores/envStore'

const { Text } = Typography
const { TextArea } = Input

export default function DocumentPage() {
  const { id } = useParams()
  const { environment } = useEnvStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const isPublic = environment === 'public'
  const primaryColor = isPublic ? '#1890ff' : '#52c41a'

  // AI 辅助生成
  const handleAIGenerate = async () => {
    if (!content.trim()) {
      message.warning('请先输入一些内容或要点')
      return
    }
    
    setAiLoading(true)
    try {
      // 调用 AI 服务
      const result = await window.electronAPI.ai.generate(
        `请根据以下要点，生成一份规范的公文内容：\n${content}`
      )
      setContent(result.content)
      message.success('AI 生成完成')
    } catch (error) {
      message.error('AI 生成失败，请重试')
      console.error(error)
    } finally {
      setAiLoading(false)
    }
  }

  // 保存文档
  const handleSave = async () => {
    if (!title.trim()) {
      message.warning('请输入文档标题')
      return
    }
    
    try {
      if (id) {
        await window.electronAPI.document.update(id, { title, content })
      } else {
        await window.electronAPI.document.create({ title, content, type: 'notice' })
      }
      message.success('保存成功')
    } catch (error) {
      message.error('保存失败')
      console.error(error)
    }
  }

  return (
    <div>
      <Card>
        {/* 工具栏 */}
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            style={{ backgroundColor: primaryColor }}
          >
            保存
          </Button>
          <Button
            icon={<RobotOutlined />}
            loading={aiLoading}
            onClick={handleAIGenerate}
          >
            AI 辅助
          </Button>
          <Button icon={<ExportOutlined />}>
            导出
          </Button>
        </Space>

        <Divider />

        {/* 标题输入 */}
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">文档标题</Text>
          <Input
            placeholder="请输入文档标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginTop: 8, fontSize: 18 }}
            size="large"
          />
        </div>

        {/* 内容编辑器 */}
        <div>
          <Text type="secondary">文档内容</Text>
          <TextArea
            placeholder="请输入文档内容，或输入要点后点击 AI 辅助生成..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ marginTop: 8, minHeight: 400, fontSize: 15 }}
            autoSize={{ minRows: 15 }}
          />
        </div>

        {/* 状态栏 */}
        <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
          <Space split={<Divider type="vertical" />}>
            <span>字数: {content.length}</span>
            <span>环境: {isPublic ? '公网' : '私域'}</span>
            <span>{id ? `文档 ID: ${id}` : '新建文档'}</span>
          </Space>
        </div>
      </Card>
    </div>
  )
}
