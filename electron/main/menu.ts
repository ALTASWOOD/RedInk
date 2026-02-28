/**
 * 应用菜单配置
 * @description 配置应用的原生菜单
 */

import { Menu, shell, app, BrowserWindow } from 'electron'

/**
 * 创建应用菜单
 */
export function createMenu(): void {
  const isMac = process.platform === 'darwin'

  const template: Electron.MenuItemConstructorOptions[] = [
    // macOS 应用菜单
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' as const, label: '关于 RedInk' },
              { type: 'separator' as const },
              { role: 'services' as const, label: '服务' },
              { type: 'separator' as const },
              { role: 'hide' as const, label: '隐藏 RedInk' },
              { role: 'hideOthers' as const, label: '隐藏其他' },
              { role: 'unhide' as const, label: '全部显示' },
              { type: 'separator' as const },
              { role: 'quit' as const, label: '退出 RedInk' }
            ]
          }
        ]
      : []),

    // 文件菜单
    {
      label: '文件',
      submenu: [
        {
          label: '新建公文',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow?.webContents.send('menu:new-document')
          }
        },
        {
          label: '打开...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow?.webContents.send('menu:open-document')
          }
        },
        { type: 'separator' },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow?.webContents.send('menu:save-document')
          }
        },
        {
          label: '另存为...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow?.webContents.send('menu:save-as-document')
          }
        },
        { type: 'separator' },
        {
          label: '导出为 Word',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow?.webContents.send('menu:export-docx')
          }
        },
        {
          label: '导出为 PDF',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow?.webContents.send('menu:export-pdf')
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close', label: '关闭' } : { role: 'quit', label: '退出' }
      ]
    },

    // 编辑菜单
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'delete', label: '删除' },
        { type: 'separator' },
        { role: 'selectAll', label: '全选' }
      ]
    },

    // 视图菜单
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '切换全屏' }
      ]
    },

    // 窗口菜单
    {
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'zoom', label: '缩放' },
        ...(isMac
          ? [
              { type: 'separator' as const },
              { role: 'front' as const, label: '前置全部窗口' }
            ]
          : [{ role: 'close' as const, label: '关闭' }])
      ]
    },

    // 帮助菜单
    {
      label: '帮助',
      submenu: [
        {
          label: '使用帮助',
          click: () => {
            shell.openExternal('https://redink.app/help')
          }
        },
        {
          label: '关于 RedInk',
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow()
            focusedWindow?.webContents.send('menu:about')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
