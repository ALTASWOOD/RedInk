/**
 * 文档列表页
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Table, Button, Space, Input, Empty, Typography, Popconfirm, message } from 'antd'
import {
  FileAddOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import type { Document } from '@stores/documentStore'

const { Title } = Typography

export default function DocumentListPage() {
  const navigate = useNavigate()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')

  // 加载文档列表
  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const list = await window.electronAPI.document.list()
      setDocuments(list as Document[])
    } catch (error) {
      console.error('Failed to load documents:', error)
    } finally {
      setLoading(false)
    }
  }

  // 删除文档
  const handleDelete = async (id: string) => {
    try {
      await window.electronAPI.document.delete(id)
      message.success('删除成功')
      loadDocuments()
    } catch (error) {
      message.error('删除失败')
    }
  }

  // 过滤文档
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Document) => (
        <a onClick={() => navigate(`/document/${record.id}`)}>{text}</a>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: Document) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/document/${record.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个文档吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card>
        {/* 页面标题和操作栏 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>我的文档</Title>
          <Space>
            <Input
              placeholder="搜索文档..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<FileAddOutlined />}
              onClick={() => navigate('/document')}
            >
              新建文档
            </Button>
          </Space>
        </div>

        {/* 文档列表 */}
        {filteredDocuments.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredDocuments}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty
            description="暂无文档"
            style={{ padding: '60px 0' }}
          >
            <Button
              type="primary"
              icon={<FileAddOutlined />}
              onClick={() => navigate('/document')}
            >
              创建第一个文档
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  )
}
