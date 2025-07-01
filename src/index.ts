#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = "https://app.yinxiang.com";
const USER_AGENT = "yx-app/1.0";

// 从环境变量读取认证信息，如果没有则使用默认值进行测试
const AUTH_TOKEN = process.env.YINXIANG_AUTH_TOKEN;

console.error("Using AUTH_TOKEN:", AUTH_TOKEN ? "Token found" : "No token");

// Create server instance
const server = new McpServer({
  name: "yxbj-mcp",
  version: "1.0.2",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function makeRequest<T>(url: string, options: { method: string; headers: { [key: string]: string; }; body: string; }): Promise<T | null> {
    const headers = {
      "User-Agent": USER_AGENT,
      ...options.headers,
    };
  
    try {
      const response = await fetch(url, { 
        method: options.method,
        headers: headers,
        body: options.body
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return (await response.json()) as T;
    } catch (error) {
      console.error("Error making API request:", error);
      return null;
    }
  }

// 添加测试连接工具
server.tool(
    "test-connection",
    "Test MCP connection and return system info",
    {
      message: z.string().optional().describe("Optional test message"),
    },
    async ({ message }) => {
      const timestamp = new Date().toLocaleString('zh-CN');
      const testMessage = message || "Hello from MCP!";
      
      console.error(`[${timestamp}] Test tool called with message: ${testMessage}`);
      
      return {
        content: [
          {
            type: "text",
            text: `🎉 MCP连接测试成功！
          📝 测试信息：
          - 时间: ${timestamp}
          - 消息: ${testMessage}
          - 服务: yxbj-mcp v1.0.0
          - 状态: 连接正常
          - Node版本: ${process.version}
          - 平台: ${process.platform}

          ✅ 如果你能看到这条消息，说明MCP服务已经成功连接到Cursor环境中！`,
          },
        ],
      };
    }
);

server.tool(
    "save-note",
    "Save note to yinxiang",
    {
      title: z.string().describe("Title of the note"),
      content: z.string().describe("Content of the note"),
    },
    async ({ title, content }) => {
      console.error("Saving note to yinxiang", title, content);
      const response = await makeRequest<{
        code: number;
        message: string;
        data: {
          noteId: string;
        };
      }>(`${API_BASE}/third/third-party-note-service/restful/v1/createNoteFromMCP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth": AUTH_TOKEN || ""
        },
        body: JSON.stringify({ title, content }),
      });
      // 打印完整的response信息用于调试
      console.error("API Response:", JSON.stringify(response, null, 2));
      
      let responseText = "Failed to save note";
      if (response) {
        responseText = `Response details:
- Code: ${response.code || 'N/A'}
- Message: ${response.message || 'No message'}
- Data: ${JSON.stringify(response.data || {}, null, 2)}
- Full Response: ${JSON.stringify(response, null, 2)}`;
      } else {
        responseText = "No response received from API";
      }
      
      return {
        content: [
          {
            type: "text",
            text: responseText,
          },
        ],
      };
    }
);

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
    console.error("MCP Server starting...");
    console.error("Tools registered: test-connection, save-note");
  }
  
  main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });