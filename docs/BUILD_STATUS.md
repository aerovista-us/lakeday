# Lake Day — Build Status

Updated: 2026-08-21

## Status

**ACTIVE BUILD · MVP SLICE 1 IN SOURCE**

## Working now

- Next.js 16 / React 19 / TypeScript foundation
- AeroVista Local branding and analytics foundation
- Live server-side weather fetch from Open-Meteo
- Live air-quality fetch from Open-Meteo when available
- 10-minute source caching with stale-while-revalidate
- Current temperature / apparent temperature / wind / gusts
- Near-term precipitation probability
- Near-term thunderstorm detection from WMO weather codes
- US AQI
- Sunrise / sunset
- Activity selection: Boat / Swim / Paddle / Beach / Fishing
- Deterministic activity-aware recommendation engine
- GO / USE CAUTION / SKIP result with score and reasons
- Safe failure mode: no recommendation if primary live weather is unavailable
- Share flow
- Explicit source status
- 1200×630 OpenGraph image
- Production-domain + separate-Umami environment contract

## Intentionally incomplete

- Verified boating / lake alert feed
- Water temperature
- Lake level
- Beach directory
- Boat launch directory
- Launch closures / status
- Webcams
- Per-activity deep links
- PWA/installability
- Dedicated Umami website ID
- Vercel project / custom domain connection

## Next slice

**Places + official notice layer**

1. Identify durable official boating / lake-notice sources.
2. Add beaches and public launches with source URLs and directions.
3. Add last-verified timestamps for each non-weather data source.
4. Add source-aware degraded states so missing lake notices never appear as “all clear.”
5. Add activity-specific place suggestions.

## Launch blockers

- Must connect a verified official alert / notice source or clearly ship without an alert claim.
- Must create separate Umami site ID.
- Must deploy to Vercel and connect `lakeday.aerovista.us`.
- Must pass mobile QA and Meta Sharing Debugger.

## Product safety rule

Lake Day is a planning aid, not a guarantee of safe water conditions. Weather, air-quality and place data must remain deterministic/source-backed, and unavailable data must be labeled unavailable rather than inferred.
