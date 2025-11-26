export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing required field: query" });
  }

  try {
    const response = await fetch("https://docs.hedera.com/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",              // <-- Drop SSE accept
        "Prefer": "return=representation"          // <-- Ask for non-stream
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "tools/call",
        params: {
          name: "SearchHedera",
          arguments: { query },
          stream: false                            // <-- Force JSON mode
        }
      })
    });

    const text = await response.text();

    // Try to parse into JSON
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON returned from MCP server",
        raw: text
      });
    }

  } catch (error) {
    return res.status(500).json({
      error: "Error contacting Hedera MCP server",
      details: error.message
    });
  }
}
