# mcp-airquality

Air Quality MCP — wraps air-quality-api.open-meteo.com (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_air_quality` | Check current air quality at a location (latitude/longitude or city name, e.g., "40.7128, -74.0060" or "New York"). Returns US AQI score, PM2.5, PM10, CO, NO2, and ozone levels. |
| `get_forecast` | Get hourly air quality forecast for a location. Returns US AQI, PM2.5, and PM10 predictions. Use to plan activities or alert users to upcoming poor air conditions. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "airquality": {
      "url": "https://gateway.pipeworx.io/airquality/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Airquality data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
