"use client";

import { useEffect, useMemo, useState } from "react";
import { lakePlaces } from "@/data/places";
import { trackEvent } from "@/lib/analytics";
import { Activity, LakeConditions, recommendLakeDay } from "@/lib/recommendation";

type ApiPayload = {
  ok: boolean;
  error?: string;
  conditions?: LakeConditions & { pm25?: number | null };
  sources?: { weather?: string; airQuality?: string; lakeAlerts?: string };
};

const activities: Array<{ id: Activity; label: string; icon: string }> = [
  { id: "boat", label: "Boat", icon: "🚤" },
  { id: "swim", label: "Swim", icon: "🏊" },
  { id: "paddle", label: "Paddle", icon: "🛶" },
  { id: "beach", label: "Beach", icon: "🏖️" },
  { id: "fishing", label: "Fishing", icon: "🎣" }
];

function formatTime(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" }).format(date);
}

function value(value: number | null | undefined, suffix = "") {
  return value == null || !Number.isFinite(value) ? "—" : `${Math.round(value)}${suffix}`;
}

function placeType(type: string) {
  if (type === "boat-launch") return "Boat launch";
  if (type === "paddle-launch") return "Paddle + swim";
  return "Beach + swim";
}

export default function Home() {
  const [activity, setActivity] = useState<Activity>("boat");
  const [payload, setPayload] = useState<ApiPayload | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/conditions", { cache: "no-store" });
      const data = (await response.json()) as ApiPayload;
      setPayload(data);
      if (data.ok) trackEvent("recommendation_view", { activity, source: "live" });
    } catch {
      setPayload({ ok: false, error: "Lake Day could not reach its live condition sources." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    trackEvent("journey_start", { surface: "today" });
    load();
    // Initial-load only. Activity changes are tracked separately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recommendation = useMemo(() => {
    if (!payload?.ok || !payload.conditions) return null;
    return recommendLakeDay(payload.conditions, activity);
  }, [payload, activity]);

  const chooseActivity = (next: Activity) => {
    setActivity(next);
    trackEvent("activity_select", { activity: next });
    if (payload?.ok) trackEvent("recommendation_view", { activity: next, source: "live" });
  };

  const share = async () => {
    const text = recommendation
      ? `Lake Day says ${recommendation.verdict} for ${activity} on Lake Coeur d'Alene — ${recommendation.headline}`
      : "Check today's Lake Coeur d'Alene conditions with Lake Day.";
    trackEvent("share_result", { activity, verdict: recommendation?.verdict || "unavailable" });
    if (navigator.share) {
      try {
        await navigator.share({ title: "Lake Day", text, url: window.location.origin });
        return;
      } catch {
        return;
      }
    }
    await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
    alert("Lake Day link copied.");
  };

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">LD</div>
          <div><strong>Lake Day</strong><span>Lake Coeur d&apos;Alene · live conditions</span></div>
        </div>
        <button className="ghost-button" onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</button>
      </header>

      <section className="hero">
        <p className="eyebrow">AEROVISTA LOCAL · NORTH IDAHO</p>
        <h1>Is today a good lake day?</h1>
        <p className="lede">A fast, explainable recommendation built from live weather, wind and air-quality data. Pick what you&apos;re doing and Lake Day adjusts the call.</p>
      </section>

      <section className="activity-strip" aria-label="Lake activity">
        {activities.map((item) => (
          <button key={item.id} className={`activity ${activity === item.id ? "active" : ""}`} onClick={() => chooseActivity(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </section>

      {loading && !payload ? (
        <section className="verdict-card loading-card"><div className="pulse" /><p>Checking Lake Coeur d&apos;Alene…</p></section>
      ) : !payload?.ok || !payload.conditions ? (
        <section className="verdict-card unavailable">
          <div className="status-pill">LIVE DATA UNAVAILABLE</div>
          <h2>No recommendation yet.</h2>
          <p>{payload?.error || "The live weather source did not respond."}</p>
          <p className="safe-copy">Lake Day will not guess at conditions when its primary source is unavailable.</p>
          <button className="primary-button" onClick={load}>Try again</button>
        </section>
      ) : recommendation ? (
        <>
          <section className={`verdict-card verdict-${recommendation.verdict.toLowerCase().replace(" ", "-")}`}>
            <div className="verdict-row">
              <div><p className="mini-label">FOR {activity.toUpperCase()}</p><h2>{recommendation.verdict}</h2></div>
              <div className="score-ring" aria-label={`Lake Day score ${recommendation.score} out of 100`}><strong>{recommendation.score}</strong><span>/100</span></div>
            </div>
            <h3>{recommendation.headline}</h3>
            <div className="reason-list">{recommendation.reasons.slice(0, 5).map((reason) => <p key={reason}>✓ {reason}</p>)}</div>
            <div className="hero-actions"><button className="primary-button" onClick={share}>Share this call</button><a className="secondary-button" href="#conditions">See conditions</a></div>
          </section>

          <section className="section" id="conditions">
            <div className="section-heading"><div><p className="eyebrow">RIGHT NOW</p><h2>Conditions</h2></div><span className="verified">Updated {formatTime(payload.conditions.updatedAt)}</span></div>
            <div className="metric-grid">
              <article className="metric"><span>Air temp</span><strong>{value(payload.conditions.temperatureF, "°")}</strong><small>Feels {value(payload.conditions.apparentTemperatureF, "°")}</small></article>
              <article className="metric"><span>Wind</span><strong>{value(payload.conditions.windMph, " mph")}</strong><small>Gusts {value(payload.conditions.gustMph, " mph")}</small></article>
              <article className="metric"><span>Rain risk</span><strong>{value(payload.conditions.precipitationProbability, "%")}</strong><small>Next several hours</small></article>
              <article className="metric"><span>Air quality</span><strong>{value(payload.conditions.aqi)}</strong><small>US AQI</small></article>
              <article className="metric"><span>Sunrise</span><strong>{formatTime(payload.conditions.sunrise)}</strong><small>Local time</small></article>
              <article className="metric"><span>Sunset</span><strong>{formatTime(payload.conditions.sunset)}</strong><small>Local time</small></article>
            </div>
          </section>
        </>
      ) : null}

      <section className="section" id="places">
        <div className="section-heading"><div><p className="eyebrow">VERIFIED LOCAL PLACES</p><h2>Where to get on the water</h2></div><span className="verified">City of Coeur d&apos;Alene sources</span></div>
        <div className="place-grid">
          {lakePlaces.map((place) => (
            <article className="place-card" key={place.id}>
              <p className="place-type">{placeType(place.type)}</p>
              <h3>{place.name}</h3>
              <p>{place.summary}</p>
              <ul>{place.notes.slice(0, 2).map((note) => <li key={note}>{note}</li>)}</ul>
              <div className="event-actions">
                <a href={place.directionsUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent("place_click", { place_id: place.id, action: "directions" })}>Directions ↗</a>
                <a href={place.sourceUrl} target="_blank" rel="noreferrer" onClick={() => trackEvent("source_click", { source: "city_of_cda", place_id: place.id })}>City source ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-grid">
        <article className="info-card">
          <p className="eyebrow">SOURCE STATUS</p>
          <h2>What Lake Day knows</h2>
          <p><strong>Weather:</strong> {payload?.sources?.weather || "Open-Meteo"}</p>
          <p><strong>Air quality:</strong> {payload?.sources?.airQuality || "Pending"}</p>
          <p><strong>Automated lake alerts:</strong> Not connected yet.</p>
          <div className="source-links">
            <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" onClick={() => trackEvent("source_click", { source: "open_meteo" })}>Weather source ↗</a>
            <a href="https://www.kcsheriff.com/AlertCenter.aspx" target="_blank" rel="noreferrer" onClick={() => trackEvent("source_click", { source: "kootenai_alert_center" })}>Kootenai alerts ↗</a>
            <a href="https://kcsheriff.com/31/Operations-Bureau" target="_blank" rel="noreferrer" onClick={() => trackEvent("source_click", { source: "kootenai_marine" })}>Marine Patrol ↗</a>
          </div>
        </article>
        <article className="info-card warning-card">
          <p className="eyebrow">SAFETY NOTE</p>
          <h2>Useful, not a guarantee.</h2>
          <p>Lake conditions can change quickly and local hazards may not be reflected in weather data. Check the sky, wind, water and official local notices before heading out.</p>
        </article>
      </section>

      <section className="section coming-next">
        <p className="eyebrow">NEXT LAYER</p>
        <h2>Water data + webcams.</h2>
        <p>Next up: reliable water temperature, lake level, live webcams and a stronger boating-notice layer.</p>
      </section>

      <footer>Lake Day · An AeroVista Local utility · Coeur d&apos;Alene, Idaho</footer>
    </main>
  );
}
