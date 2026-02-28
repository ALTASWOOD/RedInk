/**
 * 文档状态管理
 */

import { create } from 'zustand'

/**
 * 文档类型
 */
export interface Document {
  id: string
  title: string
  content: string
  type: string
  templateId?: string
  createdAt: string
  updatedAt: string
}

/**
 * 文档状态接口
 */
interface DocumentState {
  /** 当前打开的文档 */
  currentDocument: Document | null
  /** 文档列表 */
  documents: Document[]
  /** 是否正在加载 */
  loading: boolean
  /** 设置当前文档 */
  setCurrentDocument: (doc: Document | null) => void
  /** 设置文档列表 */
  setDocuments: (docs: Document[]) => void
  /** 添加文档 */
  addDocument: (doc: Document) => void
  /** 更新文档 */
  updateDocument: (id: string, data: Partial<Document>) => void
  /** 删除文档 */
  removeDocument: (id: string) => void
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void
}

/**
 * 文档状态 Store
 */
export const useDocumentStore = create<DocumentState>((set, get) => ({
  currentDocument: null,
  documents: [],
  loading: false,
  
  setCurrentDocument: (doc) => set({ currentDocument: doc }),
  
  setDocuments: (docs) => set({ documents: docs }),
  
  addDocument: (doc) => set({ documents: [...get().documents, doc] }),
  
  updateDocument: (id, data) => {
    const { documents, currentDocument } = get()
    const updatedDocs = documents.map((doc) =>
      doc.id === id ? { ...doc, ...data } : doc
    )
    set({
      documents: updatedDocs,
      currentDocument:
        currentDocument?.id === id
          ? { ...currentDocument, ...data }
          : currentDocument
    })
  },
  
  removeDocument: (id) => {
    const { documents, currentDocument } = get()
    set({
      documents: documents.filter((doc) => doc.id !== id),
      currentDocument: currentDocument?.id === id ? null : currentDocument
    })
  },
  
  setLoading: (loading) => set({ loading })
}))
