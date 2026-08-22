import { NextResponse } from "next/server";

const LAT = 47.6777;
const LON = -116.7805;
const TIMEZONE = "America/Los_Angeles";

function localHourKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day}T${map.hour}:00`;
}

async function getJson(url: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": "AeroVista-LakeDay/0.1" },
    next: { revalidate: 600 }
  });
  if (!response.ok) throw new Error(`Upstream returned ${response.status}`);
  return response.json();
}

export async function GET() {
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.searchParams.set("latitude", String(LAT));
  weatherUrl.searchParams.set("longitude", String(LON));
  weatherUrl.searchParams.set("current", "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m");
  weatherUrl.searchParams.set("hourly", "precipitation_probability,weather_code");
  weatherUrl.searchParams.set("daily", "sunrise,sunset");
  weatherUrl.searchParams.set("temperature_unit", "fahrenheit");
  weatherUrl.searchParams.set("wind_speed_unit", "mph");
  weatherUrl.searchParams.set("precipitation_unit", "inch");
  weatherUrl.searchParams.set("timezone", TIMEZONE);
  weatherUrl.searchParams.set("forecast_days", "2");

  const airUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  airUrl.searchParams.set("latitude", String(LAT));
  airUrl.searchParams.set("longitude", String(LON));
  airUrl.searchParams.set("current", "us_aqi,pm2_5");
  airUrl.searchParams.set("timezone", TIMEZONE);

  const [weatherResult, airResult] = await Promise.allSettled([
    getJson(weatherUrl.toString()),
    getJson(airUrl.toString())
  ]);

  if (weatherResult.status === "rejected") {
    return NextResponse.json(
      {
        ok: false,
        error: "Live weather is temporarily unavailable. Lake Day will not invent a recommendation without it.",
        sources: { weather: "unavailable", airQuality: airResult.status === "fulfilled" ? "ok" : "unavailable" }
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const weather = weatherResult.value;
  const air = airResult.status === "fulfilled" ? airResult.value : null;
  const hourKey = localHourKey();
  const hourlyTimes: string[] = weather.hourly?.time ?? [];
  const startIndex = Math.max(0, hourlyTimes.findIndex((time) => time >= hourKey));
  const nextSixPrecip: number[] = (weather.hourly?.precipitation_probability ?? []).slice(startIndex, startIndex + 6);
  const nextSixCodes: number[] = (weather.hourly?.weather_code ?? []).slice(startIndex, startIndex + 6);
  const stormCodes = new Set([95, 96, 99]);

  const precipitationProbability = nextSixPrecip.length
    ? Math.max(...nextSixPrecip.filter((value) => Number.isFinite(value)))
    : null;
  const nearTermStorm = nextSixCodes.some((code) => stormCodes.has(code));
  const currentCode = weather.current?.weather_code ?? null;

  return NextResponse.json({
    ok: true,
    location: { name: "Lake Coeur d'Alene", latitude: LAT, longitude: LON, timezone: TIMEZONE },
    conditions: {
      temperatureF: weather.current?.temperature_2m ?? null,
      apparentTemperatureF: weather.current?.apparent_temperature ?? null,
      windMph: weather.current?.wind_speed_10m ?? null,
      gustMph: weather.current?.wind_gusts_10m ?? null,
      precipitationProbability,
      weatherCode: nearTermStorm ? 95 : currentCode,
      aqi: air?.current?.us_aqi ?? null,
      pm25: air?.current?.pm2_5 ?? null,
      sunrise: weather.daily?.sunrise?.[0] ?? null,
      sunset: weather.daily?.sunset?.[0] ?? null,
      updatedAt: new Date().toISOString()
    },
    sources: {
      weather: "Open-Meteo Weather API",
      airQuality: air ? "Open-Meteo Air Quality API" : "unavailable",
      lakeAlerts: "not-connected"
    }
  }, {
    headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300" }
  });
}
