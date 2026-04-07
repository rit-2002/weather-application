function Spinner() {
  return (
    <div
      className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"
      aria-label="Loading"
      role="status"
    />
  );
}

function getConditionMeta(conditionMain) {
  switch (conditionMain) {
    case "Clear":
      return { icon: "☀️", accent: "text-amber-600" };
    case "Clouds":
      return { icon: "☁️", accent: "text-slate-600" };
    case "Rain":
      return { icon: "🌧️", accent: "text-indigo-600" };
    case "Drizzle":
      return { icon: "🌦️", accent: "text-sky-600" };
    case "Thunderstorm":
      return { icon: "⛈️", accent: "text-violet-600" };
    case "Snow":
      return { icon: "❄️", accent: "text-cyan-700" };
    case "Mist":
    case "Smoke":
    case "Haze":
      return { icon: "🌫️", accent: "text-teal-700" };
    default:
      return { icon: "🌡️", accent: "text-slate-700" };
  }
}

export default function WeatherCard({ weather, loading, error }) {
  const conditionMain = weather?.weather?.[0]?.main ?? null;
  const condition = getConditionMeta(conditionMain);

  const tempC =
    typeof weather?.tempC === "number"
      ? Math.round(weather.tempC)
      : weather?.main?.temp
        ? Math.round(weather.main.temp - 273.15)
        : null;

  const humidity = weather?.main?.humidity ?? null;
  const windSpeed = weather?.wind?.speed ?? null;

  return (
    <section className="mt-4 rounded-2xl border border-black/5 bg-white/80 p-6 shadow-lg backdrop-blur">
      {loading ? (
        <div className="flex items-center gap-4">
          <Spinner />
          <div className="min-w-0">
            <p className="text-slate-900 font-semibold">Fetching weather...</p>
            <p className="text-sm text-slate-500">Please wait a moment.</p>
          </div>
        </div>
      ) : error ? (
        <div>
          <p className="text-slate-900 font-semibold">Couldn&apos;t get the weather.</p>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      ) : weather ? (
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-slate-900">
                {weather?.name ?? "Unknown city"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Weather: <span className={`font-semibold ${condition.accent}`}>{conditionMain ?? "N/A"}</span>
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100">
              <span className="text-2xl" aria-hidden="true">
                {condition.icon}
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900">
                {tempC === null ? "--" : `${tempC}°C`}
              </p>
              <p className="text-sm text-slate-500">Temperature in Celsius</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-600">Humidity</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {humidity === null ? "--" : `${humidity}%`}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-600">Wind</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {windSpeed === null ? "--" : `${windSpeed} m/s`}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-slate-900 font-semibold">Search a city to see the weather.</p>
          <p className="mt-2 text-sm text-slate-500">Example: Pune</p>
        </div>
      )}
    </section>
  );
}

