# 🌤️ Weather Picnic Planner Submission

For this project I chose to try out [TanStack Start](https://tanstack.com/start/latest), a full-stack React framework, as well as any other applicable TanStack frameworks (in this case Query, Router, and Form). I had been seeing a lot of good things regarding the DX and wanted to see what the fuss was all about, plus it seemed like a good challenge with something new.

## Running locally

To run this application:

```bash
cp .env.example .env
pnpm install
pnpm dev
```

## Functionality

### Routes and Navigation

- `/`: Two-week calendar with color-coded suitability.
- `/day/:date`: Detailed daily view (forecast vs 10-year historical comparison).
- `/settings`: Location and picnic preferences.

### User Settings Storage

For a picnic planning app it made sense to allow the user to specify some of their ideal criterias as to what would make for an ideal day out. Here I'm using TanStack Form with Zod for validation. When the user saves their settings they are stored via localStorage.

### Open-Meteo Integration

To allow for easy substitution/addition of alternative weather data sources an `IWeatherProvider` interface was extracted and for now just `OpenMeteoProvider` is implemented. I used the factory/provider pattern in `weather-provider.ts`, that for now is controlled by an env var (`WEATHER_PROVIDER`), but I could see a future implementation where the user is able to select which provider they prefer from the settings page.

I'm using TanStack Query for client side query caching with 15-minute stale time for current forecast data, and 1 hour stale time on historical. For caching on the server-side, I chose the `lru-cache` package for in-memory caching and have TTL's of 1 hour for current forecasting data, and 24 hours for historical forecast data. A limitation here is no persistent server cache.

### Suitability Calculation

The main driver of suitability (implemented in `src/lib/suitability.ts`) is the forecasted temperatures. This is a pretty simplistic take and if I were to spend more time I'd tweak this first.

- Ideal: within idealTempMin and idealTempMax, precipitation chance <= maxPrecipitationChance, wind <= maxWindSpeed, humidity <= humidityThreshold.
- Fair: within fairTempMin and fairTempMax and same non-temp thresholds.
- Otherwise: Poor.
