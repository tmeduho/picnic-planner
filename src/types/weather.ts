import { z } from 'zod'

// response schemas
export const dailyWeatherSchema = z.object({
  time: z.array(z.string()),
  temperature_2m_max: z.array(z.number()),
  temperature_2m_min: z.array(z.number()),
  precipitation_probability_max: z.array(z.number()),
  wind_speed_10m_max: z.array(z.number()),
  relative_humidity_2m_mean: z.array(z.number()),
})

export const forecastResponseSchema = z.object({
  daily: dailyWeatherSchema,
})

export const historicalResponseSchema = z.object({
  daily: dailyWeatherSchema.extend({
    precipitation_sum: z.array(z.number()),
  }),
})

export type ForecastResponse = z.infer<typeof forecastResponseSchema>
export type HistoricalResponse = z.infer<typeof historicalResponseSchema>
export type DailyWeatherData = z.infer<typeof dailyWeatherSchema>

export interface IWeatherProvider {
  /**
   * Fetches 14-day forecast (daily summaries).
   * @param lat - Latitude (WGS84)
   * @param lon - Longitude (WGS84)
   * @param startDate - ISO yyyy-MM-dd (today)
   * @param endDate - ISO yyyy-MM-dd (today + 13 days)
   * @returns Normalized forecast data
   */
  getForecast(lat: number, lon: number, tz: string): Promise<ForecastResponse>

  /**
   * Fetches historical daily data for a specific date over past N years.
   * @param lat - Latitude
   * @param lon - Longitude
   * @param targetDate - ISO yyyy-MM-dd (e.g., '2025-09-06')
   * @param tz - Timezone string (e.g., 'America/New_York')
   * @param yearsBack - Number of years (default 10)
   * @returns Normalized historical data, filtered to matching month/day across years
   */
  getHistorical(
    lat: number,
    lon: number,
    targetDate: string,
    tz: string,
    yearsBack?: number,
  ): Promise<HistoricalResponse>
}

export class WeatherApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'WeatherApiError'
  }
}
