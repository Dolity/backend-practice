const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

export class WeatherError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const normalize = (city, current, resolvedAddress) => ({
  city: resolvedAddress || city,
  temperature: current.temp,
  conditions: current.conditions,
  humidity: current.humidity,
  windSpeed: current.windspeed,
  fetchedAt: new Date().toISOString(),
});

export const fetchWeather = async (city, apiKey) => {
  const url = `${BASE_URL}/${encodeURIComponent(city)}?key=${apiKey}&unitGroup=metric`;

  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new WeatherError(502, "Weather service unavailable");
  }

  if (res.status === 400 || res.status === 404) {
    throw new WeatherError(404, "City not found");
  }
  if (!res.ok) {
    throw new WeatherError(502, "Weather service unavailable");
  }

  const data = await res.json();
  const current = data.currentConditions ?? data.days?.[0];
  if (!current) {
    throw new WeatherError(502, "Weather service unavailable");
  }

  return normalize(city, current, data.resolvedAddress);
};
