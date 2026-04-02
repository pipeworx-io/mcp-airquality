# @pipeworx/mcp-airquality

MCP server for the [Open-Meteo Air Quality API](https://air-quality-api.open-meteo.com) — current air quality conditions and hourly forecasts by location. Free, no auth required.

## Tools

| Tool | Description |
|------|-------------|
| `get_air_quality` | Current AQI, PM2.5, PM10, CO, NO2, and ozone for a location |
| `get_forecast` | Hourly air quality forecast (1-7 days) |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "airquality": {
      "type": "url",
      "url": "https://gateway.pipeworx.io/airquality"
    }
  }
}
```

## CLI Usage

```bash
npx @anthropic-ai/mcp-client https://gateway.pipeworx.io/airquality
```

## License

MIT
