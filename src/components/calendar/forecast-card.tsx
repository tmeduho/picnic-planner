import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  classifySuitability,
  suitabilityToClasses,
  type Suitability,
} from '@/lib/suitability'
import { useWeatherSettings } from '@/hooks/use-weather-settings'

interface Props {
  date: string
  temperatureMax: number
  temperatureMin: number
  precipitationProbability: number
  windSpeed: number
  humidity: number
}

export function ForecastCard({
  date,
  temperatureMax,
  temperatureMin,
  precipitationProbability,
  windSpeed,
  humidity,
}: Props) {
  const { settings } = useWeatherSettings()
  const suitability: Suitability | undefined = settings
    ? classifySuitability(
        {
          maxTempF: temperatureMax,
          minTempF: temperatureMin,
          precipitationChancePct: precipitationProbability,
          maxWindMph: windSpeed,
          humidityMeanPct: humidity,
        },
        settings,
      )
    : undefined
  return (
    <Link to="/day/$date" params={{ date }}>
      <Card
        className={cn(
          'hover:shadow-md transition-shadow cursor-pointer border',
          suitability && suitabilityToClasses(suitability),
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">
              {Math.round(temperatureMax)}°
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(temperatureMin)}°
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <div>Rain: {Math.round(precipitationProbability)}%</div>
            <div>Wind: {Math.round(windSpeed)} mph</div>
            <div>Humidity: {Math.round(humidity)}%</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
