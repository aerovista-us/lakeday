"use client";

import { trackEvent } from "@/lib/analytics";

const AEROVISTA_URL = "https://aerovista.us/?utm_source=lakeday&utm_medium=referral&utm_campaign=local_tools&utm_content=brand_badge";

export default function AeroVistaLocalBadge() {
  return (
    <a
      className="av-badge"
      href={AEROVISTA_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="AeroVista Local — Built in Coeur d'Alene"
      onClick={() => trackEvent("brand_click", { placement: "persistent_badge" })}
    >
      <span className="av-mark" aria-hidden="true">AV</span>
      <span><strong>AeroVista Local</strong><small>Built in Coeur d'Alene · ↗</small></span>
    </a>
  );
}
