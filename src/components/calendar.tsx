import { ForecastCard } from './forecast-card'
import type { DailyWeatherData } from '../types/weather'

interface CalendarProps {
  forecast: DailyWeatherData
}

export function Calendar({ forecast }: CalendarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {forecast.time.map((date: string, index: number) => (
        <ForecastCard
          key={date}
          date={date}
          temperatureMax={forecast.temperature_2m_max[index]}
          temperatureMin={forecast.temperature_2m_min[index]}
          precipitationProbability={
            forecast.precipitation_probability_max[index]
          }
          windSpeed={forecast.wind_speed_10m_max[index]}
        />
      ))}
    </div>
  )
}
