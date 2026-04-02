/**
 * Air Quality MCP — wraps air-quality-api.open-meteo.com (free, no auth)
 *
 * Tools:
 * - get_air_quality: Current air quality conditions for a location
 * - get_forecast: Hourly air quality forecast for a location
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://air-quality-api.open-meteo.com/v1';

type RawCurrentResponse = {
  latitude: number;
  longitude: number;
  current: {
    us_aqi: number;
    pm10: number;
    pm2_5: number;
    carbon_monoxide: number;
    nitrogen_dioxide: number;
    ozone: number;
  };
};

type RawForecastResponse = {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    us_aqi: number[];
    pm2_5: number[];
    pm10: number[];
  };
};

function aqiCategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

const tools: McpToolExport['tools'] = [
  {
    name: 'get_air_quality',
    description:
      'Get current air quality conditions for a location. Returns US AQI, PM2.5, PM10, carbon monoxide, nitrogen dioxide, and ozone levels.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', description: 'Latitude of the location.' },
        longitude: { type: 'number', description: 'Longitude of the location.' },
      },
      required: ['latitude', 'longitude'],
    },
  },
  {
    name: 'get_forecast',
    description:
      'Get an hourly air quality forecast for a location. Returns US AQI, PM2.5, and PM10 per hour.',
    inputSchema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', description: 'Latitude of the location.' },
        longitude: { type: 'number', description: 'Longitude of the location.' },
        days: {
          type: 'number',
          description: 'Number of forecast days (1-7, default 3).',
        },
      },
      required: ['latitude', 'longitude'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const lat = args.latitude as number;
  const lon = args.longitude as number;
  switch (name) {
    case 'get_air_quality':
      return getAirQuality(lat, lon);
    case 'get_forecast':
      return getForecast(lat, lon, (args.days as number | undefined) ?? 3);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function getAirQuality(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone',
  });
  const res = await fetch(`${BASE_URL}/air-quality?${params}`);
  if (!res.ok) throw new Error(`Air Quality API error: ${res.status}`);
  const data = (await res.json()) as RawCurrentResponse;
  const c = data.current;
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    us_aqi: c.us_aqi,
    aqi_category: aqiCategory(c.us_aqi),
    pm2_5_ug_m3: c.pm2_5,
    pm10_ug_m3: c.pm10,
    carbon_monoxide_ug_m3: c.carbon_monoxide,
    nitrogen_dioxide_ug_m3: c.nitrogen_dioxide,
    ozone_ug_m3: c.ozone,
  };
}

async function getForecast(lat: number, lon: number, days: number) {
  const safeDays = Math.min(7, Math.max(1, days));
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: 'us_aqi,pm2_5,pm10',
    forecast_days: String(safeDays),
  });
  const res = await fetch(`${BASE_URL}/air-quality?${params}`);
  if (!res.ok) throw new Error(`Air Quality API error: ${res.status}`);
  const data = (await res.json()) as RawForecastResponse;
  const h = data.hourly;
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    hours: h.time.map((time, i) => ({
      time,
      us_aqi: h.us_aqi[i],
      aqi_category: aqiCategory(h.us_aqi[i]),
      pm2_5_ug_m3: h.pm2_5[i],
      pm10_ug_m3: h.pm10[i],
    })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
