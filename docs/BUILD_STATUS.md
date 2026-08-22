# Lake Day — Build Status

Updated: 2026-08-21

## Status

**ACTIVE BUILD · MVP SLICE 2 IN SOURCE**

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
- Verified local place directory with City of Coeur d'Alene sources
- 3rd Street Boat Ramp with current City-listed launch notes/fees
- Independence Point beach / swim area
- Atlas Mill Park accessible swim / kayak launch
- Direct Kootenai County Alert Center and Marine Patrol safety-source links
- 1200×630 OpenGraph image
- Production-domain + separate-Umami environment contract

## Intentionally incomplete

- Automated boating / lake alert ingestion
- Water temperature
- Lake level
- Launch closures / status automation
- Webcams
- More beaches / launches beyond the initial verified set
- Per-activity deep links
- PWA/installability
- Dedicated Umami website ID
- Vercel project / custom domain connection

## Next slice

**Water data + stronger notice layer**

1. Find a durable water-temperature source.
2. Find a reliable lake-level source.
3. Determine whether Kootenai alerts / marine notices expose a stable machine-readable feed; if not, keep them source links rather than scraping fragile HTML.
4. Add webcams where the provider permits direct linking/embedding.
5. Add activity-specific place suggestions and per-activity share/deep links.

## Launch blockers

- Automated alerts may remain out of MVP only if the UI continues to state clearly that no automated lake-alert feed is connected.
- Must create separate Umami site ID.
- Must deploy to Vercel and connect `lakeday.aerovista.us`.
- Must pass mobile QA and Meta Sharing Debugger.

## Product safety rule

Lake Day is a planning aid, not a guarantee of safe water conditions. Weather, air-quality and place data must remain deterministic/source-backed, and unavailable data must be labeled unavailable rather than inferred.
