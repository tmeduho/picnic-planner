import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface Props {
  temperatureMax: number
  precipitationProbability: number
  windSpeed: number
  humidity: number
  avgTempMax: number
  avgWind: number
  avgHumidity: number
}

export function DayComparison({
  temperatureMax,
  precipitationProbability,
  windSpeed,
  humidity,
  avgTempMax,
  avgWind,
  avgHumidity,
}: Props) {
  const temperatureClassName =
    temperatureMax > avgTempMax
      ? 'text-red-600'
      : temperatureMax < avgTempMax - 5
        ? 'text-blue-600'
        : 'text-green-600'

  const precipitationClassName =
    precipitationProbability > 30 ? 'text-blue-600' : 'text-green-600'

  const windClassName =
    windSpeed > avgWind + 2 ? 'text-orange-600' : 'text-green-600'

  const humidityClassName =
    humidity > avgHumidity + 10
      ? 'text-blue-600'
      : humidity < avgHumidity - 10
        ? 'text-orange-600'
        : 'text-green-600'

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Comparison to Historical Average</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Temperature</p>
            <p className={`text-lg font-semibold ${temperatureClassName}`}>
              {temperatureMax > avgTempMax
                ? 'Warmer'
                : temperatureMax < avgTempMax - 5
                  ? 'Colder'
                  : 'Average'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Precipitation</p>
            <p className={`text-lg font-semibold ${precipitationClassName}`}>
              {precipitationProbability > 30 ? 'Wet' : 'Dry'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Wind</p>
            <p className={`text-lg font-semibold ${windClassName}`}>
              {windSpeed > avgWind + 2 ? 'Windy' : 'Calm'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Humidity</p>
            <p className={`text-lg font-semibold ${humidityClassName}`}>
              {humidity > avgHumidity + 10
                ? 'Humid'
                : humidity < avgHumidity - 10
                  ? 'Dry'
                  : 'Normal'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
