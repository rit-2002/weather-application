const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

function getApiKey() {
  return import.meta.env.VITE_OPENWEATHER_API_KEY;
}

export async function fetchWeatherByCity(city) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error(
      "Missing OpenWeather API key. Please set VITE_OPENWEATHER_API_KEY in your .env file."
    );
  }

  const url = `${OPENWEATHER_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  const kelvin = data?.main?.temp;
  const tempC = typeof kelvin === "number" ? kelvin - 273.15 : null;

  return {
    ...data,
    tempC,
  };
}

