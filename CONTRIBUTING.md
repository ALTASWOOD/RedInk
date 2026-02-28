# 贡献指南

感谢您对 RedInk 项目的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 报告 Bug

1. 在 [Issues](https://github.com/ALTASWOOD/RedInk/issues) 中搜索是否已有相似问题
2. 如果没有，创建新的 Issue，请包含：
   - 问题描述
   - 复现步骤
   - 期望行为
   - 实际行为
   - 环境信息（操作系统、应用版本）
   - 相关截图或日志

### 提交功能建议

1. 在 Issues 中创建新的 Feature Request
2. 描述您期望的功能
3. 说明使用场景和预期效果

### 提交代码

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 开发环境

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/ALTASWOOD/RedInk.git
cd RedInk

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 构建打包

```bash
# 构建 Windows 版本
pnpm build:win

# 构建 macOS 版本
pnpm build:mac
```

## 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 规则
- 提交前确保代码通过 lint 检查
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)

## Commit 信息规范

```
<type>(<scope>): <subject>

类型(type):
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式（不影响代码运行的变动）
- refactor: 重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动
```

示例：
```
feat(editor): 添加公文模板功能
fix(ai): 修复私域模式下 AI 响应中断问题
docs: 更新安装说明
```

## 项目结构

```
RedInk/
├── electron/          # Electron 主进程
│   ├── main/          # 主进程代码
│   └── preload/       # 预加载脚本
├── src/               # React 渲染进程
│   ├── components/    # 组件
│   ├── pages/         # 页面
│   ├── stores/        # 状态管理
│   └── services/      # 服务层
├── docs/              # 项目文档
└── public/            # 静态资源
```

## 行为准则

请阅读我们的 [行为准则](CODE_OF_CONDUCT.md)。

## 联系我们

如有问题，欢迎在 Issues 中讨论。

## 致谢

感谢所有贡献者的付出！
