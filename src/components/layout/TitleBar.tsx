/**
 * 自定义标题栏组件
 * 集成 Electron 窗口控制功能
 */

import { useState, useEffect } from 'react'
import { Tooltip, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import {
  MinusOutlined,
  BorderOutlined,
  CloseOutlined,
  BlockOutlined,
  AppstoreOutlined
} from '@ant-design/icons'

// 获取 Electron API
const electronAPI = (window as any).electronAPI

interface TitleBarProps {
  title?: string
}

export default function TitleBar({ title = 'RedInk - AI公文报告编写软件' }: TitleBarProps) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isFocused, setIsFocused] = useState(true)

  useEffect(() => {
    if (!electronAPI?.window) return

    // 获取初始状态
    electronAPI.window.isMaximized().then(setIsMaximized)

    // 监听窗口状态变化
    const cleanupMaximized = electronAPI.window.onMaximizedChange(setIsMaximized)
    const cleanupFocus = electronAPI.window.onFocusChange(setIsFocused)

    return () => {
      cleanupMaximized?.()
      cleanupFocus?.()
    }
  }, [])

  const handleMinimize = () => {
    electronAPI?.window?.minimize()
  }

  const handleMaximize = () => {
    electronAPI?.window?.maximize()
  }

  const handleClose = () => {
    electronAPI?.window?.close()
  }

  // 菜单项
  const fileMenuItems: MenuProps['items'] = [
    { key: 'new', label: '新建文档', onClick: () => console.log('新建') },
    { key: 'open', label: '打开文档...', onClick: () => console.log('打开') },
    { type: 'divider' },
    { key: 'save', label: '保存', onClick: () => console.log('保存') },
    { key: 'saveAs', label: '另存为...', onClick: () => console.log('另存为') },
    { type: 'divider' },
    { key: 'exportDocx', label: '导出为 Word', onClick: () => console.log('导出Word') },
    { key: 'exportPdf', label: '导出为 PDF', onClick: () => console.log('导出PDF') },
    { type: 'divider' },
    { key: 'exit', label: '退出', onClick: handleClose }
  ]

  const editMenuItems: MenuProps['items'] = [
    { key: 'undo', label: '撤销' },
    { key: 'redo', label: '重做' },
    { type: 'divider' },
    { key: 'cut', label: '剪切' },
    { key: 'copy', label: '复制' },
    { key: 'paste', label: '粘贴' },
    { type: 'divider' },
    { key: 'selectAll', label: '全选' }
  ]

  const viewMenuItems: MenuProps['items'] = [
    { key: 'zoomIn', label: '放大' },
    { key: 'zoomOut', label: '缩小' },
    { key: 'resetZoom', label: '重置缩放' },
    { type: 'divider' },
    { key: 'fullscreen', label: '全屏', onClick: () => electronAPI?.window?.toggleFullScreen() }
  ]

  const helpMenuItems: MenuProps['items'] = [
    { key: 'docs', label: '使用文档' },
    { key: 'shortcuts', label: '快捷键' },
    { type: 'divider' },
    { key: 'about', label: '关于 RedInk' }
  ]

  return (
    <div 
      className={`title-bar ${!isFocused ? 'title-bar-blur' : ''}`}
    >
      {/* 左侧：应用图标和菜单 */}
      <div className="title-bar-left">
        {/* 应用图标 */}
        <div style={{ 
          width: 32, 
          height: 32, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginLeft: 4
        }}>
          <AppstoreOutlined style={{ fontSize: 16, color: '#1890ff' }} />
        </div>

        {/* 菜单栏 */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Dropdown menu={{ items: fileMenuItems }} trigger={['click']}>
            <div className="title-bar-menu-item">文件</div>
          </Dropdown>
          <Dropdown menu={{ items: editMenuItems }} trigger={['click']}>
            <div className="title-bar-menu-item">编辑</div>
          </Dropdown>
          <Dropdown menu={{ items: viewMenuItems }} trigger={['click']}>
            <div className="title-bar-menu-item">视图</div>
          </Dropdown>
          <Dropdown menu={{ items: helpMenuItems }} trigger={['click']}>
            <div className="title-bar-menu-item">帮助</div>
          </Dropdown>
        </div>
      </div>

      {/* 中间：标题 */}
      <div 
        className="title-bar-center"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 12,
          color: isFocused ? '#262626' : '#8c8c8c'
        }}
      >
        {title}
      </div>

      {/* 右侧：窗口控制按钮 */}
      <div className="title-bar-right">
        {/* 最小化 */}
        <Tooltip title="最小化" mouseEnterDelay={0.5}>
          <div 
            className="title-bar-btn"
            onClick={handleMinimize}
          >
            <MinusOutlined style={{ fontSize: 12 }} />
          </div>
        </Tooltip>

        {/* 最大化/还原 */}
        <Tooltip title={isMaximized ? '还原' : '最大化'} mouseEnterDelay={0.5}>
          <div 
            className="title-bar-btn"
            onClick={handleMaximize}
          >
            {isMaximized ? (
              <BlockOutlined style={{ fontSize: 12 }} />
            ) : (
              <BorderOutlined style={{ fontSize: 12 }} />
            )}
          </div>
        </Tooltip>

        {/* 关闭 */}
        <Tooltip title="关闭" mouseEnterDelay={0.5}>
          <div 
            className="title-bar-btn title-bar-btn-close"
            onClick={handleClose}
          >
            <CloseOutlined style={{ fontSize: 12 }} />
          </div>
        </Tooltip>
      </div>
    </div>
  )
}
