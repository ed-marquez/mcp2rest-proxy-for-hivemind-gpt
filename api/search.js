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
        // REQUIRED by Hedera MCP
        "Accept": "application/json, text/event-stream",
        // Preferred but not guaranteed
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "tools/call",
        params: {
          name: "SearchHedera",
          arguments: { query },
          stream: false
        }
      })
    });

    const raw = await response.text();

    // --- CASE 1: Server returned SSE ---
    if (raw.startsWith("event:")) {
      // find the "data:" lines
      const dataLine = raw
        .split("\n")
        .find(line => line.startsWith("data:"));

      if (!dataLine) {
        return res.status(500).json({
          error: "SSE format returned but no data field found",
          raw
        });
      }

      const jsonPart = dataLine.replace("data:", "").trim();

      try {
        const parsed = JSON.parse(jsonPart);
        return res.status(200).json(parsed);
      } catch (err) {
        return res.status(500).json({
          error: "Failed to parse SSE data as JSON",
          raw: jsonPart
        });
      }
    }

    // --- CASE 2: Server returned proper JSON ---
    try {
      const parsedJson = JSON.parse(raw);
      return res.status(200).json(parsedJson);
    } catch {
      return res.status(500).json({
        error: "Server returned non-JSON and non-SSE",
        raw
      });
    }

  } catch (error) {
    return res.status(500).json({
      error: "Error contacting Hedera MCP server",
      details: error.message
    });
  }
}
