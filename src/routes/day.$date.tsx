import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useWeatherSettings } from '../hooks/use-weather-settings'
import { getForecast } from '../server/functions/getForcast'
import { getHistorical } from '../server/functions/getHistorical'
import { average, getLocationDisplay } from '../lib/utils'
import { HistoricalAverages } from '../components/details/historical-averages'
import { DayComparison } from '../components/details/day-comparison'
import { CurrentForecast } from '../components/details/current-forecast'
import { FullScreenMessage } from '../components/common/full-screen-message'
import { format, parseISO } from 'date-fns'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/day/$date')({
  component: DayDetails,
})

function DayDetails() {
  const { date } = Route.useParams()
  const {
    settings,
    userTimezone,
    isLoading: isSettingsLoading,
    isReady,
  } = useWeatherSettings()

  // get current forecast data
  const {
    data: forecast,
    isLoading: isForecastLoading,
    error: forecastError,
  } = useQuery({
    queryKey: [
      'forecast',
      settings?.location.latitude,
      settings?.location.longitude,
      userTimezone,
    ],
    queryFn: () =>
      getForecast({
        data: {
          lat: settings!.location.latitude,
          lon: settings!.location.longitude,
          tz: userTimezone,
        },
      }),
    enabled: isReady && !!settings,
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })

  // get historical forecast data
  const {
    data: historical,
    isLoading: isHistoricalLoading,
    error: historicalError,
  } = useQuery({
    queryKey: [
      'historical',
      settings?.location.latitude,
      settings?.location.longitude,
      date,
      userTimezone,
    ],
    queryFn: () =>
      getHistorical({
        data: {
          lat: settings!.location.latitude,
          lon: settings!.location.longitude,
          date,
          tz: userTimezone,
        },
      }),
    enabled: isReady && !!settings && !!date,
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })

  const isLoading =
    isSettingsLoading || isForecastLoading || isHistoricalLoading
  const errorMessage = forecastError?.message || historicalError?.message

  if (isLoading) return <FullScreenMessage message="Loading day details..." />

  if (errorMessage)
    return (
      <FullScreenMessage
        message={`Error loading data: ${errorMessage}`}
        messageClassName="text-red-600"
      />
    )

  if (!forecast || !historical)
    return <FullScreenMessage message="No data available" />

  // find the forecast data for the specific date
  const dateIndex = forecast.daily.time.indexOf(date)
  if (dateIndex === -1) {
    return (
      <FullScreenMessage
        message="Date not found in forecast"
        messageClassName="text-red-600"
      />
    )
  }

  const dayForecast = {
    date: forecast.daily.time[dateIndex],
    temperatureMax: forecast.daily.temperature_2m_max[dateIndex],
    temperatureMin: forecast.daily.temperature_2m_min[dateIndex],
    precipitationProbability:
      forecast.daily.precipitation_probability_max?.[dateIndex] ?? 0,
    windSpeed: forecast.daily.wind_speed_10m_max[dateIndex],
    humidity: forecast.daily.relative_humidity_2m_mean[dateIndex],
  }

  // calculate historical averages
  const { avgTempMax, avgTempMin, avgPrecip, avgWind, avgHumidity } = {
    avgTempMax: average(historical.daily.temperature_2m_max),
    avgTempMin: average(historical.daily.temperature_2m_min),
    avgPrecip: average(historical.daily.precipitation_sum),
    avgWind: average(historical.daily.wind_speed_10m_max),
    avgHumidity: average(historical.daily.relative_humidity_2m_mean),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="link" size="sm" asChild>
            <Link to="/">← Back to Calendar</Link>
          </Button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Weather Details for {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
          </h2>
          <p className="text-lg text-gray-600">
            Forecast for {getLocationDisplay(settings)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrentForecast
            temperatureMax={dayForecast.temperatureMax}
            temperatureMin={dayForecast.temperatureMin}
            precipitationProbability={dayForecast.precipitationProbability}
            windSpeed={dayForecast.windSpeed}
            humidity={dayForecast.humidity}
          />

          <HistoricalAverages
            avgTempMax={avgTempMax}
            avgTempMin={avgTempMin}
            avgPrecip={avgPrecip}
            avgWind={avgWind}
            avgHumidity={avgHumidity}
          />
        </div>

        <DayComparison
          temperatureMax={dayForecast.temperatureMax}
          precipitationProbability={dayForecast.precipitationProbability}
          windSpeed={dayForecast.windSpeed}
          humidity={dayForecast.humidity}
          avgTempMax={avgTempMax}
          avgWind={avgWind}
          avgHumidity={avgHumidity}
        />
      </div>
    </div>
  )
}
