export type Activity = "boat" | "swim" | "paddle" | "beach" | "fishing";
export type Verdict = "GO" | "USE CAUTION" | "SKIP";

export type LakeConditions = {
  temperatureF: number | null;
  apparentTemperatureF: number | null;
  windMph: number | null;
  gustMph: number | null;
  precipitationProbability: number | null;
  weatherCode: number | null;
  aqi: number | null;
  sunrise: string | null;
  sunset: string | null;
  updatedAt: string;
};

export type Recommendation = {
  verdict: Verdict;
  score: number;
  headline: string;
  reasons: string[];
};

const stormCodes = new Set([95, 96, 99]);

export function recommendLakeDay(conditions: LakeConditions, activity: Activity): Recommendation {
  let score = 100;
  const reasons: string[] = [];
  const gust = conditions.gustMph ?? conditions.windMph;
  const wind = conditions.windMph;
  const rain = conditions.precipitationProbability;
  const temp = conditions.temperatureF;
  const aqi = conditions.aqi;

  if (conditions.weatherCode != null && stormCodes.has(conditions.weatherCode)) {
    score -= 75;
    reasons.push("Thunderstorm conditions are the strongest reason to stay off the water.");
  }

  if (rain != null) {
    if (rain >= 70) {
      score -= 30;
      reasons.push(`${Math.round(rain)}% near-term precipitation chance makes plans unreliable.`);
    } else if (rain >= 40) {
      score -= 14;
      reasons.push(`${Math.round(rain)}% precipitation chance is worth watching.`);
    } else {
      reasons.push(`Low near-term precipitation risk (${Math.round(rain)}%).`);
    }
  }

  if (gust != null) {
    const paddlePenalty = activity === "paddle" ? 1.45 : activity === "boat" ? 1.15 : 1;
    if (gust >= 30) {
      score -= Math.round(38 * paddlePenalty);
      reasons.push(`Gusts near ${Math.round(gust)} mph are a major water-safety concern.`);
    } else if (gust >= 20) {
      score -= Math.round(22 * paddlePenalty);
      reasons.push(`Gusts near ${Math.round(gust)} mph can make exposed water uncomfortable or difficult.`);
    } else if (wind != null && wind <= 10) {
      reasons.push(`Light wind around ${Math.round(wind)} mph is favorable.`);
    }
  }

  if (aqi != null) {
    if (aqi >= 151) {
      score -= 35;
      reasons.push(`AQI ${Math.round(aqi)} is unhealthy for prolonged outdoor activity.`);
    } else if (aqi >= 101) {
      score -= 20;
      reasons.push(`AQI ${Math.round(aqi)} may be uncomfortable for sensitive groups.`);
    } else if (aqi <= 50) {
      reasons.push(`Air quality is good (AQI ${Math.round(aqi)}).`);
    }
  }

  if (temp != null) {
    if (temp < 55) {
      score -= activity === "swim" ? 28 : 14;
      reasons.push(`${Math.round(temp)}°F air temperature is cool for a lake day.`);
    } else if (temp >= 65 && temp <= 88) {
      score += 5;
      reasons.push(`${Math.round(temp)}°F air temperature is comfortable for most lake activities.`);
    } else if (temp >= 96) {
      score -= 12;
      reasons.push(`${Math.round(temp)}°F heat raises hydration and sun-exposure concerns.`);
    }
  }

  score = Math.max(0, Math.min(100, score));

  if (score < 45) {
    return { verdict: "SKIP", score, headline: "Conditions are working against a good lake day.", reasons };
  }
  if (score < 75) {
    return { verdict: "USE CAUTION", score, headline: "Possible, but check the conditions before committing.", reasons };
  }
  return { verdict: "GO", score, headline: "Conditions look favorable for getting outside.", reasons };
}
