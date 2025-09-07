import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface ForecastCardProps {
  date: string
  temperatureMax: number
  temperatureMin: number
  precipitationProbability: number
  windSpeed: number
}

export function ForecastCard({
  date,
  temperatureMax,
  temperatureMin,
  precipitationProbability,
  windSpeed,
}: ForecastCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
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
        </div>
      </CardContent>
    </Card>
  )
}
