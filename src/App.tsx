/**
 * React 根组件
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEnvStore } from '@stores/envStore'
import MainLayout from '@components/layout/MainLayout'
import HomePage from '@pages/HomePage'
import DocumentPage from '@pages/DocumentPage'
import DocumentListPage from '@pages/DocumentListPage'
import TemplatePage from '@pages/TemplatePage'
import SettingsPage from '@pages/SettingsPage'
import './styles/index.css'

function App() {
  const { environment } = useEnvStore()
  
  // 根据环境设置主题类名
  const themeClass = environment === 'public' ? 'theme-public' : 'theme-private'

  return (
    <div className={`app ${themeClass}`}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="documents" element={<DocumentListPage />} />
            <Route path="document/:id?" element={<DocumentPage />} />
            <Route path="templates" element={<TemplatePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
