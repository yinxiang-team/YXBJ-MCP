# YXBJ-MCP

> 印象笔记 MCP 服务器，支持通过 Model Context Protocol 保存笔记到印象笔记

## 简介

YXBJ-MCP 是一个 MCP (Model Context Protocol) 服务器，可以让 AI 助手（如 Cursor）直接与印象笔记进行交互，实现笔记的创建和保存功能。

## 功能特性

- ✅ **连接测试** - 测试 MCP 连接状态
- ✅ **保存笔记** - 将内容保存到印象笔记
- ✅ **Markdown 支持** - 支持丰富的文本格式
- ✅ **环境变量配置** - 安全的认证方式

## 安装和使用

### 方式1：使用 npx（推荐）

```bash
# 直接运行，无需安装
npx yxbj-mcp
```

### 方式2：全局安装

```bash
# 全局安装
npm install -g yxbj-mcp

# 运行
yxbj-mcp
```

### 方式3：本地开发

```bash
# 克隆项目
git clone [your-repo-url]
cd YXBJ-MCP

# 安装依赖
npm install

# 构建项目
npm run build

# 运行
npm start
```

## 环境配置

在使用前，需要设置环境变量：

### 方式1：临时设置（推荐用于测试）
```bash
# 临时设置环境变量并运行
YINXIANG_AUTH_TOKEN="your_token" npx yxbj-mcp
```

### 方式2：全局设置
```bash
# 设置环境变量
export YINXIANG_AUTH_TOKEN="your_yinxiang_auth_token"

# 然后运行
npx yxbj-mcp
```

### 方式3：使用.env文件（本地开发）
```bash
# 复制示例文件
cp env.example .env

# 编辑.env文件，填入你的token
# 然后运行
npm run dev
```

## 在 Cursor 中使用

1. 在 Cursor 的 MCP 配置中添加：

```json
{
  "mcpServers": {
    "yxbj-mcp": {
      "command": "npx",
      "args": ["yxbj-mcp"],
      "env": {
        "YINXIANG_AUTH_TOKEN": "your_token_here"
      }
    }
  }
}
```

2. 重启 Cursor，即可在 AI 助手中使用印象笔记功能

## 可用工具

### test-connection
测试 MCP 连接状态，返回系统信息

### save-note
保存笔记到印象笔记
- `title`: 笔记标题
- `content`: 笔记内容（支持 Markdown）

## 开发

```bash
# 安装依赖
npm install

# 开发模式（TypeScript）
npm run build

# 测试
npm test
```

## 许可证

ISC

## 贡献

欢迎提交 Issue 和 Pull Request！ 