import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface Props {
  temperatureMax: number
  temperatureMin: number
  precipitationProbability: number
  windSpeed: number
  humidity: number
}

export function CurrentForecast({
  temperatureMax,
  temperatureMin,
  precipitationProbability,
  windSpeed,
  humidity,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Forecast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Temperature</span>
          <span className="text-lg font-semibold">
            {Math.round(temperatureMax)}° / {Math.round(temperatureMin)}°
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Precipitation Chance</span>
          <span className="text-lg font-semibold">
            {Math.round(precipitationProbability)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Wind Speed</span>
          <span className="text-lg font-semibold">
            {Math.round(windSpeed)} mph
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Humidity</span>
          <span className="text-lg font-semibold">{Math.round(humidity)}%</span>
        </div>
      </CardContent>
    </Card>
  )
}
