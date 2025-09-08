import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getForecast } from '../server/functions/getForcast'
import { Calendar } from '../components/calendar/calendar'
import { useWeatherSettings } from '../hooks/use-weather-settings'
import { getLocationDisplay } from '../lib/utils'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const {
    settings,
    userTimezone,
    isLoading: isSettingsLoading,
    isReady,
  } = useWeatherSettings()

  const {
    data: forecast,
    isLoading,
    error,
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
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Plan Your Perfect Picnic
          </h2>
          <p className="text-lg text-gray-600">
            Choose the best weather for your time outdoors
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Two-Week Weather Forecast for {getLocationDisplay(settings)}
          </h3>

          <div className="flex items-center gap-6 text-sm mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded border border-green-300 bg-green-50" />
              <span className="text-gray-700">Ideal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded border border-yellow-300 bg-yellow-50" />
              <span className="text-gray-700">Fair</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded border border-red-300 bg-red-50" />
              <span className="text-gray-700">Poor</span>
            </div>
          </div>

          {isSettingsLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading...</p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Loading forecast for {getLocationDisplay(settings)}...
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">
                Error loading forecast for {getLocationDisplay(settings)}:{' '}
                {error.message}
              </p>
            </div>
          )}

          {forecast && <Calendar forecast={forecast.daily} />}
        </div>
      </div>
    </div>
  )
}
