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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "tools/call", // MCP-required call structure
          params: {
            name: "SearchHedera",
            arguments: { query }
          }
        })
      });
  
      const data = await response.json();
  
      // Forward raw MCP result back to GPT
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({
        error: "Error contacting Hedera MCP server",
        details: error.message
      });
    }
  }
  