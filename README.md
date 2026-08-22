# Lake Day

AeroVista Local utility for answering one question quickly: **Is today a good lake day, and what should I know before I go?**

Initial geography: Lake Coeur d'Alene / North Idaho.

## Current build

The first MVP slice is live in source:

- Next.js 16 + TypeScript
- Live Open-Meteo weather
- Live Open-Meteo US AQI / PM2.5 when available
- Near-term precipitation and thunderstorm awareness
- Deterministic `GO / USE CAUTION / SKIP` recommendation engine
- Activity-specific tuning for Boat / Swim / Paddle / Beach / Fishing
- Explicit degraded state when weather is unavailable
- AeroVista Local attribution
- Separate Umami configuration contract
- OpenGraph / Facebook share card
- Production domain target: `https://lakeday.aerovista.us`

## Important product rule

The recommendation is **deterministic and explainable**. No LLM is allowed to invent weather, air quality, lake hazards, closures, or safety conditions.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production environment

Copy `.env.example` into the deployment environment and provide a Lake Day-specific Umami website ID.

```env
NEXT_PUBLIC_SITE_URL=https://lakeday.aerovista.us
NEXT_PUBLIC_UMAMI_URL=https://stats.aerocoreos.com
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<lake-day-specific-id>
NEXT_PUBLIC_UMAMI_DOMAINS=lakeday.aerovista.us,.vercel.app
```

## Data sources

- Open-Meteo Weather API
- Open-Meteo Air Quality API

Lake / boating notices are **not connected yet**. The UI says so explicitly rather than presenting an incomplete feed as authoritative.

## Next build slices

1. Connect verified boating / lake notices.
2. Add beaches and boat launches.
3. Add water temperature and lake-level sources if reliable data is available.
4. Add webcams.
5. Add shareable per-activity result URLs.
6. Add PWA/installability and notification experiment.

## Analytics baseline

- `journey_start`
- `activity_select`
- `recommendation_view`
- `source_click`
- `share_result`
- `brand_click`

No sensitive user content should ever be sent in analytics payloads.

---

**AeroVista Local** · Useful local tools built in Coeur d'Alene.
