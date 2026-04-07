import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import WeatherCard from "./components/WeatherCard.jsx";
import { fetchWeatherByCity } from "./services/weatherService.js";

const DEFAULT_CITY = "Pune";

function getBackgroundGradient(conditionMain) {
  switch (conditionMain) {
    case "Clear":
      return "from-amber-200 via-orange-100 to-yellow-100";
    case "Clouds":
      return "from-slate-200 via-sky-100 to-slate-50";
    case "Rain":
    case "Drizzle":
      return "from-sky-200 via-indigo-100 to-slate-50";
    case "Thunderstorm":
      return "from-indigo-200 via-violet-100 to-slate-50";
    case "Snow":
      return "from-cyan-200 via-slate-100 to-white";
    case "Mist":
    case "Smoke":
    case "Haze":
      return "from-slate-200 via-teal-100 to-slate-50";
    default:
      return "from-sky-200 via-slate-100 to-white";
  }
}

export default function App() {
  const [inputCity, setInputCity] = useState(DEFAULT_CITY);
  const [searchCity, setSearchCity] = useState(DEFAULT_CITY);

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [backgroundGradient, setBackgroundGradient] = useState(
    getBackgroundGradient(null)
  );

  // Debounce user typing before triggering a search.
  useEffect(() => {
    const t = setTimeout(() => {
      const next = inputCity.trim();
      if (next) setSearchCity(next);
    }, 500);

    return () => clearTimeout(t);
  }, [inputCity]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const city = searchCity.trim();
      if (!city) return;

      setLoading(true);
      setError(null);
      setWeather(null);

      try {
        const data = await fetchWeatherByCity(city);
        if (cancelled) return;

        setWeather(data);
        setBackgroundGradient(getBackgroundGradient(data?.weather?.[0]?.main));
      } catch (err) {
        if (cancelled) return;

        const status = err?.status;
        const message =
          status === 404
            ? "City not found. Please check the spelling."
            : err?.message || "Failed to fetch weather. Please try again.";

        setError(message);
        setWeather(null);
        setBackgroundGradient(getBackgroundGradient(null));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [searchCity]);

  const containerClasses = useMemo(
    () =>
      `min-h-screen flex items-center justify-center p-4 bg-gradient-to-br ${backgroundGradient} transition-colors duration-500`,
    [backgroundGradient]
  );

  return (
    <div className={containerClasses}>
      <div className="w-full max-w-md">
        <SearchBar value={inputCity} onChange={setInputCity} onSearch={setSearchCity} />
        <WeatherCard weather={weather} loading={loading} error={error} />
      </div>
    </div>
  );
}

