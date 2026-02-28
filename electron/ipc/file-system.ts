/**
 * 文件系统相关 IPC 处理器
 */

import { dialog, app } from 'electron'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import type { IpcHandler } from './index'

export const fileSystemIpcHandlers: IpcHandler[] = [
  {
    channel: 'fs:open-file-dialog',
    handler: async (_event, options?: Electron.OpenDialogOptions) => {
      const result = await dialog.showOpenDialog({
        title: '打开文件',
        filters: [
          { name: 'Word 文档', extensions: ['docx', 'doc'] },
          { name: '所有文件', extensions: ['*'] }
        ],
        properties: ['openFile'],
        ...options
      })
      return result
    }
  },
  {
    channel: 'fs:save-file-dialog',
    handler: async (_event, options?: Electron.SaveDialogOptions) => {
      const result = await dialog.showSaveDialog({
        title: '保存文件',
        filters: [
          { name: 'Word 文档', extensions: ['docx'] },
          { name: 'PDF 文档', extensions: ['pdf'] }
        ],
        ...options
      })
      return result
    }
  },
  {
    channel: 'fs:read-file',
    handler: async (_event, filePath: string) => {
      const content = await readFile(filePath)
      return content.toString('base64')
    }
  },
  {
    channel: 'fs:write-file',
    handler: async (_event, filePath: string, data: string) => {
      const buffer = Buffer.from(data, 'base64')
      await writeFile(filePath, buffer)
      return { success: true }
    }
  },
  {
    channel: 'fs:get-app-path',
    handler: async () => {
      return app.getPath('userData')
    }
  },
  {
    channel: 'fs:get-documents-path',
    handler: async () => {
      return join(app.getPath('documents'), 'RedInk')
    }
  }
]
