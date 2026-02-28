/**
 * 环境状态管理
 * @description 管理公网/私域环境切换状态
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * 环境类型
 * - public: 公网环境（蓝色主题）
 * - private: 私域环境（绿色主题）
 */
export type EnvironmentType = 'public' | 'private'

/**
 * 环境状态接口
 */
interface EnvState {
  /** 当前环境 */
  environment: EnvironmentType
  /** 切换确认对话框是否显示 */
  showSwitchConfirm: boolean
  /** 设置环境 */
  setEnvironment: (env: EnvironmentType) => void
  /** 切换环境 */
  toggleEnvironment: () => void
  /** 显示切换确认对话框 */
  showConfirm: () => void
  /** 隐藏切换确认对话框 */
  hideConfirm: () => void
}

/**
 * 环境状态 Store
 */
export const useEnvStore = create<EnvState>()(
  persist(
    (set, get) => ({
      environment: 'private', // 默认私域环境
      showSwitchConfirm: false,
      
      setEnvironment: (env) => {
        set({ environment: env })
        console.log(`[EnvStore] Environment switched to: ${env}`)
      },
      
      toggleEnvironment: () => {
        const current = get().environment
        const next = current === 'public' ? 'private' : 'public'
        set({ environment: next, showSwitchConfirm: false })
        console.log(`[EnvStore] Environment toggled to: ${next}`)
      },
      
      showConfirm: () => set({ showSwitchConfirm: true }),
      
      hideConfirm: () => set({ showSwitchConfirm: false })
    }),
    {
      name: 'redink-env',
      partialize: (state) => ({ environment: state.environment })
    }
  )
)
