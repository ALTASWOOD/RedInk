/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // 公网环境色
        public: {
          primary: '#1890ff',
          light: '#e6f7ff',
          dark: '#096dd9'
        },
        // 私域环境色
        private: {
          primary: '#52c41a',
          light: '#f6ffed',
          dark: '#389e0d'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif'
        ]
      }
    }
  },
  plugins: [],
  // 避免与 Ant Design 样式冲突
  corePlugins: {
    preflight: false
  }
}
