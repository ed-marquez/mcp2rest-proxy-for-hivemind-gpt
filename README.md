# Hedera MCP Proxy (Vercel)
## mcp2rest-proxy-for-hivemind-gpt
Custom GPTs cannot directly consume MCP servers. They only consume REST/OpenAPI Actions. The MCP endpoint must be wrapped in a REST → MCP bridge. This implements that.

This project provides a lightweight REST proxy for the **Hedera MCP server** at  
https://docs.hedera.com/mcp

The proxy exposes a simple REST endpoint (`POST /api/search`) that forwards
requests to the MCP tool **SearchHedera**, making it compatible with platforms
that require REST/OpenAPI—such as **Custom GPT Actions**.

---

## 🚀 Features

- Wraps the Hedera `SearchHedera` MCP tool in a REST API
- Deployable instantly on **Vercel**
- Usable by Custom GPTs, serverless functions, or any REST client
- Zero configuration required beyond deployment

---
```
## 📁 Project Structure
├─ api/
│ └─ search.js → Vercel serverless function (REST → MCP)
├─ package.json
└─ README.md
```

## How It Works

The function calls the Hedera MCP server using the expected MCP request format:
```
{
  "method": "tools/call",
  "params": {
    "name": "SearchHedera",
    "arguments": { "query": "<your-query>" }
  }
}
```