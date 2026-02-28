/**
 * 设置页
 */

import { useState, useEffect } from 'react'
import { Card, Form, Select, Switch, Input, Button, Divider, Typography, message, Space } from 'antd'
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons'
import { useEnvStore } from '@stores/envStore'

const { Title, Text } = Typography

interface AIProvider {
  id: string
  name: string
  isAvailable: boolean
  isLocal: boolean
}

export default function SettingsPage() {
  const { environment } = useEnvStore()
  const [form] = Form.useForm()
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [loading, setLoading] = useState(false)

  const isPublic = environment === 'public'

  // 加载 AI 提供商列表
  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = async () => {
    try {
      const list = await window.electronAPI.ai.getProviders()
      setProviders(list as AIProvider[])
    } catch (error) {
      console.error('Failed to load providers:', error)
    }
  }

  // 保存设置
  const handleSave = async () => {
    setLoading(true)
    try {
      const values = form.getFieldsValue()
      await window.electronAPI.settings.set('app-settings', values)
      
      // 如果 AI 提供商有变化，更新
      if (values.aiProvider) {
        await window.electronAPI.ai.setProvider(values.aiProvider)
      }
      
      message.success('设置已保存')
    } catch (error) {
      message.error('保存失败')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // 加载已保存的设置
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await window.electronAPI.settings.get('app-settings')
        if (settings) {
          form.setFieldsValue(settings)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
    loadSettings()
  }, [form])

  return (
    <div>
      <Title level={4}>应用设置</Title>

      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            aiProvider: 'mock',
            autoSave: true,
            autoSaveInterval: 5,
            theme: 'light'
          }}
        >
          {/* AI 服务设置 */}
          <Title level={5}>AI 服务</Title>
          <Form.Item
            name="aiProvider"
            label="AI 服务提供商"
            extra={isPublic ? '公网环境：可使用云端 AI 服务' : '私域环境：建议使用本地 AI 服务'}
          >
            <Select>
              {providers.map((provider) => (
                <Select.Option
                  key={provider.id}
                  value={provider.id}
                  disabled={!provider.isAvailable}
                >
                  <Space>
                    <span>{provider.name}</span>
                    {provider.isLocal && <Text type="success">(本地)</Text>}
                    {!provider.isAvailable && <Text type="secondary">(不可用)</Text>}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="apiKey" label="API Key (仅公网环境需要)">
            <Input.Password placeholder="请输入 API Key" disabled={!isPublic} />
          </Form.Item>

          <Divider />

          {/* 编辑器设置 */}
          <Title level={5}>编辑器</Title>
          <Form.Item name="autoSave" label="自动保存" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="autoSaveInterval" label="自动保存间隔（分钟）">
            <Select>
              <Select.Option value={1}>1 分钟</Select.Option>
              <Select.Option value={3}>3 分钟</Select.Option>
              <Select.Option value={5}>5 分钟</Select.Option>
              <Select.Option value={10}>10 分钟</Select.Option>
            </Select>
          </Form.Item>

          <Divider />

          {/* 外观设置 */}
          <Title level={5}>外观</Title>
          <Form.Item name="theme" label="主题">
            <Select>
              <Select.Option value="light">浅色</Select.Option>
              <Select.Option value="dark">深色</Select.Option>
              <Select.Option value="system">跟随系统</Select.Option>
            </Select>
          </Form.Item>

          <Divider />

          {/* 操作按钮 */}
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={handleSave}
            >
              保存设置
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  )
}
