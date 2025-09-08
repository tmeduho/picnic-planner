import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface Props {
  avgTempMax: number
  avgTempMin: number
  avgPrecip: number
  avgWind: number
  avgHumidity: number
}

export function HistoricalAverages({
  avgTempMax,
  avgTempMin,
  avgPrecip,
  avgWind,
  avgHumidity,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>10-Year Historical Average</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg High/Low Temp</span>
          <span className="text-lg font-semibold">
            {Math.round(avgTempMax)}° / {Math.round(avgTempMin)}°
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg Precipitation</span>
          <span className="text-lg font-semibold">
            {Math.round(avgPrecip * 100) / 100} inches
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg Wind Speed</span>
          <span className="text-lg font-semibold">
            {Math.round(avgWind)} mph
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg Humidity</span>
          <span className="text-lg font-semibold">
            {Math.round(avgHumidity)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
