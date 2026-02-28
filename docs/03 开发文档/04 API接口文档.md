# API 接口文档

## 文档信息

| 项目 | 内容 |
|------|------|
| 文档版本 | V1.0 |
| 文档状态 | 已完成 |
| 创建日期 | 2026-02-28 |
| 最后更新 | 2026-02-28 |

---

## 1. 接口概述

### 1.1 接口架构

RedInk 采用分层接口设计：

```
┌─────────────────────────────────────────────────────────────────────┐
│                         接口架构                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     前端 Service 层                          │   │
│  │    documentService / aiService / settingsService            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Tauri Commands                            │   │
│  │              @tauri-apps/api/core invoke()                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Rust Backend                              │   │
│  │                   #[tauri::command]                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────┬──────────────────┬──────────────────────┐   │
│  │     SQLite       │   文件系统        │    外部 AI API       │   │
│  └──────────────────┴──────────────────┴──────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 通用响应格式

```typescript
// 成功响应
interface SuccessResponse<T> {
  success: true;
  data: T;
}

// 错误响应
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
```

---

## 2. 文档管理接口

### 2.1 获取文档列表

**命令**: `get_documents`

**请求参数**:
```typescript
interface GetDocumentsParams {
  environment?: 'public' | 'private';  // 环境筛选
  docType?: string;                     // 文档类型筛选
  status?: DocumentStatus;              // 状态筛选
  keyword?: string;                     // 关键词搜索
  page?: number;                        // 页码，默认 1
  pageSize?: number;                    // 每页数量，默认 20
  sortBy?: 'created_at' | 'updated_at' | 'title';
  sortOrder?: 'asc' | 'desc';
}
```

**响应**:
```typescript
interface GetDocumentsResponse {
  items: Document[];
  total: number;
  page: number;
  pageSize: number;
}
```

**前端调用示例**:
```typescript
import { invoke } from '@tauri-apps/api/core';

const result = await invoke<ApiResponse<GetDocumentsResponse>>('get_documents', {
  params: {
    environment: 'private',
    page: 1,
    pageSize: 20,
  }
});
```

### 2.2 获取单个文档

**命令**: `get_document`

**请求参数**:
```typescript
interface GetDocumentParams {
  id: string;  // 文档 ID
}
```

**响应**:
```typescript
interface GetDocumentResponse {
  document: Document;
}
```

### 2.3 创建文档

**命令**: `create_document`

**请求参数**:
```typescript
interface CreateDocumentParams {
  title: string;
  docType: DocumentType;
  templateId?: string;
  content?: DocumentContent;
  environment: 'public' | 'private';
}
```

**响应**:
```typescript
interface CreateDocumentResponse {
  document: Document;
}
```

### 2.4 更新文档

**命令**: `update_document`

**请求参数**:
```typescript
interface UpdateDocumentParams {
  id: string;
  title?: string;
  content?: DocumentContent;
  status?: DocumentStatus;
  tags?: string[];
}
```

**响应**:
```typescript
interface UpdateDocumentResponse {
  document: Document;
}
```

### 2.5 删除文档

**命令**: `delete_document`

**请求参数**:
```typescript
interface DeleteDocumentParams {
  id: string;
  permanent?: boolean;  // 是否永久删除，默认 false（软删除）
}
```

**响应**:
```typescript
interface DeleteDocumentResponse {
  success: boolean;
}
```

### 2.6 导出文档

**命令**: `export_document`

**请求参数**:
```typescript
interface ExportDocumentParams {
  id: string;
  format: 'docx' | 'pdf' | 'md' | 'ofd';
  outputPath: string;
  options?: {
    embedFonts?: boolean;
    useOfficialFormat?: boolean;
    includeHistory?: boolean;
  };
}
```

**响应**:
```typescript
interface ExportDocumentResponse {
  filePath: string;
  fileSize: number;
}
```

---

## 3. AI 服务接口

### 3.1 AI 服务健康检查

**命令**: `ai_health_check`

**请求参数**:
```typescript
interface AIHealthCheckParams {
  provider: AIProvider;
}
```

**响应**:
```typescript
interface AIHealthCheckResponse {
  available: boolean;
  latency?: number;       // 响应延迟 (ms)
  modelInfo?: {
    name: string;
    version?: string;
  };
}
```

### 3.2 内容生成

**命令**: `ai_generate`

**请求参数**:
```typescript
interface AIGenerateParams {
  docType: DocumentType;           // 公文类型
  keyPoints: string[];             // 关键要点
  additionalInfo?: string;         // 补充信息
  options?: {
    temperature?: number;          // 温度 0-2，默认 0.7
    maxTokens?: number;            // 最大 Token 数
    style?: 'formal' | 'concise';  // 风格
  };
}
```

**响应**:
```typescript
interface AIGenerateResponse {
  content: string;
  tokenUsed: number;
  model: string;
}
```

### 3.3 流式内容生成

**命令**: `ai_generate_stream`

**请求参数**: 同 `ai_generate`

**事件监听**:
```typescript
import { listen } from '@tauri-apps/api/event';

// 监听流式输出
const unlisten = await listen<string>('ai-stream-chunk', (event) => {
  console.log('Received chunk:', event.payload);
});

// 监听完成
await listen('ai-stream-complete', () => {
  console.log('Generation complete');
});

// 监听错误
await listen<string>('ai-stream-error', (event) => {
  console.error('Error:', event.payload);
});
```

### 3.4 内容审核

**命令**: `ai_review`

**请求参数**:
```typescript
interface AIReviewParams {
  content: string;                 // 待审核内容
  reviewTypes: ReviewType[];       // 审核类型
}

type ReviewType = 'format' | 'content' | 'language' | 'all';
```

**响应**:
```typescript
interface AIReviewResponse {
  score: number;                   // 总分 0-100
  passed: boolean;                 // 是否通过
  issues: ReviewIssue[];           // 问题列表
  suggestions: string[];           // 总体建议
  tokenUsed: number;
}

interface ReviewIssue {
  id: string;
  type: 'format' | 'content' | 'logic' | 'language' | 'policy';
  severity: 'high' | 'medium' | 'low';
  description: string;
  position?: {
    paragraph?: number;
    startOffset?: number;
    endOffset?: number;
  };
  originalText?: string;
  suggestion: string;
  autoFixable: boolean;
}
```

### 3.5 内容改写

**命令**: `ai_rewrite`

**请求参数**:
```typescript
interface AIRewriteParams {
  content: string;                 // 原始内容
  style: RewriteStyle;             // 改写风格
}

type RewriteStyle = 'polish' | 'simplify' | 'expand' | 'formalize';
```

**响应**:
```typescript
interface AIRewriteResponse {
  content: string;
  changes: RewriteChange[];
  tokenUsed: number;
}

interface RewriteChange {
  original: string;
  revised: string;
  reason: string;
}
```

---

## 4. 模板接口

### 4.1 获取模板列表

**命令**: `get_templates`

**请求参数**:
```typescript
interface GetTemplatesParams {
  category?: TemplateCategory;
  isBuiltin?: boolean;
  isFavorite?: boolean;
}
```

**响应**:
```typescript
interface GetTemplatesResponse {
  items: Template[];
}
```

### 4.2 获取单个模板

**命令**: `get_template`

**请求参数**:
```typescript
interface GetTemplateParams {
  id: string;
}
```

### 4.3 创建自定义模板

**命令**: `create_template`

**请求参数**:
```typescript
interface CreateTemplateParams {
  name: string;
  category: TemplateCategory;
  description?: string;
  content: TemplateContent;
  formatConfig?: TemplateFormatConfig;
}
```

### 4.4 更新模板

**命令**: `update_template`

### 4.5 删除模板

**命令**: `delete_template`

---

## 5. 图表接口

### 5.1 创建图表

**命令**: `create_chart`

**请求参数**:
```typescript
interface CreateChartParams {
  documentId?: string;
  chartType: ChartType;
  data: ChartData;
  style?: ChartStyle;
}

type ChartType = 'flowchart' | 'orgchart' | 'mindmap' | 'timeline' | 'relation';
```

**响应**:
```typescript
interface CreateChartResponse {
  chart: Chart;
  svgContent: string;
}
```

### 5.2 AI 生成图表

**命令**: `ai_generate_chart`

**请求参数**:
```typescript
interface AIGenerateChartParams {
  chartType: ChartType;
  description: string;             // 自然语言描述
}
```

**响应**:
```typescript
interface AIGenerateChartResponse {
  chart: Chart;
  svgContent: string;
  tokenUsed: number;
}
```

### 5.3 更新图表

**命令**: `update_chart`

### 5.4 删除图表

**命令**: `delete_chart`

### 5.5 导出图表为图片

**命令**: `export_chart_image`

**请求参数**:
```typescript
interface ExportChartImageParams {
  id: string;
  format: 'png' | 'svg';
  scale?: number;                  // 缩放比例，默认 2
  outputPath: string;
}
```

---

## 6. 配置接口

### 6.1 获取配置

**命令**: `get_config`

**请求参数**:
```typescript
interface GetConfigParams {
  keys?: string[];                 // 指定键，为空则返回全部
  category?: ConfigCategory;       // 按分类获取
}
```

**响应**:
```typescript
interface GetConfigResponse {
  configs: Record<string, unknown>;
}
```

### 6.2 设置配置

**命令**: `set_config`

**请求参数**:
```typescript
interface SetConfigParams {
  key: string;
  value: unknown;
  category: ConfigCategory;
  encrypted?: boolean;             // 是否加密存储
}
```

### 6.3 重置配置

**命令**: `reset_config`

**请求参数**:
```typescript
interface ResetConfigParams {
  keys?: string[];                 // 指定键，为空则重置全部
}
```

---

## 7. 环境接口

### 7.1 获取当前环境

**命令**: `get_current_environment`

**响应**:
```typescript
interface GetEnvironmentResponse {
  environment: 'public' | 'private';
  aiProvider: AIProvider;
  networkStatus: 'online' | 'offline';
}
```

### 7.2 切换环境

**命令**: `switch_environment`

**请求参数**:
```typescript
interface SwitchEnvironmentParams {
  target: 'public' | 'private';
}
```

**响应**:
```typescript
interface SwitchEnvironmentResponse {
  success: boolean;
  environment: 'public' | 'private';
  aiProvider: AIProvider;
}
```

---

## 8. 安全接口

### 8.1 敏感信息检测

**命令**: `detect_sensitive`

**请求参数**:
```typescript
interface DetectSensitiveParams {
  content: string;
}
```

**响应**:
```typescript
interface DetectSensitiveResponse {
  hasSensitive: boolean;
  items: SensitiveItem[];
}

interface SensitiveItem {
  type: 'id_card' | 'phone' | 'bank_card' | 'keyword' | 'doc_number';
  value: string;
  position: { start: number; end: number };
  suggestion: string;              // 脱敏建议
}
```

### 8.2 获取审计日志

**命令**: `get_audit_logs`

**请求参数**:
```typescript
interface GetAuditLogsParams {
  eventType?: AuditEventType;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
```

**响应**:
```typescript
interface GetAuditLogsResponse {
  items: AuditLog[];
  total: number;
}
```

---

## 9. 文件操作接口

### 9.1 选择文件

**命令**: `select_file`

**请求参数**:
```typescript
interface SelectFileParams {
  filters?: FileFilter[];
  multiple?: boolean;
  defaultPath?: string;
}

interface FileFilter {
  name: string;
  extensions: string[];
}
```

**响应**:
```typescript
interface SelectFileResponse {
  paths: string[];
}
```

### 9.2 选择保存路径

**命令**: `select_save_path`

**请求参数**:
```typescript
interface SelectSavePathParams {
  defaultPath?: string;
  defaultName?: string;
  filters?: FileFilter[];
}
```

**响应**:
```typescript
interface SelectSavePathResponse {
  path: string;
}
```

### 9.3 读取文件

**命令**: `read_file`

**请求参数**:
```typescript
interface ReadFileParams {
  path: string;
  encoding?: 'utf-8' | 'binary';
}
```

### 9.4 写入文件

**命令**: `write_file`

**请求参数**:
```typescript
interface WriteFileParams {
  path: string;
  content: string | Uint8Array;
}
```

---

## 10. 错误码定义

| 错误码 | 说明 |
|--------|------|
| `DOC_NOT_FOUND` | 文档不存在 |
| `DOC_SAVE_FAILED` | 文档保存失败 |
| `TEMPLATE_NOT_FOUND` | 模板不存在 |
| `AI_SERVICE_UNAVAILABLE` | AI服务不可用 |
| `AI_REQUEST_TIMEOUT` | AI请求超时 |
| `AI_RATE_LIMITED` | AI请求频率限制 |
| `NETWORK_ERROR` | 网络错误 |
| `ENV_SWITCH_BLOCKED` | 环境切换被阻止 |
| `SENSITIVE_DETECTED` | 检测到敏感信息 |
| `FILE_NOT_FOUND` | 文件不存在 |
| `FILE_ACCESS_DENIED` | 文件访问被拒绝 |
| `INVALID_PARAMS` | 参数无效 |
| `INTERNAL_ERROR` | 内部错误 |

---

*文档结束*
