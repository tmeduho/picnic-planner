import {
  IWeatherProvider,
  ForecastResponse,
  HistoricalResponse,
  WeatherApiError,
  forecastResponseSchema,
  historicalResponseSchema,
} from '../../types/weather'
import { fetchWeatherApi } from 'openmeteo'
import { parseISO, format, setYear, getYear } from 'date-fns'

export class OpenMeteoProvider implements IWeatherProvider {
  private readonly forecastUrl = 'https://api.open-meteo.com/v1/forecast'
  private readonly archiveUrl = 'https://archive-api.open-meteo.com/v1/archive'

  async getForecast(
    lat: number,
    lon: number,
    tz: string,
  ): Promise<ForecastResponse> {
    const params = {
      latitude: lat,
      longitude: lon,
      timezone: tz,
      forecast_days: 14,
      wind_speed_unit: 'mph',
      temperature_unit: 'fahrenheit',
      precipitation_unit: 'inch',
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'relative_humidity_2m_mean',
      ],
    }
    const responses = await fetchWeatherApi(this.forecastUrl, params)

    if (responses.length === 0) {
      throw new WeatherApiError('No forecast response received')
    }

    const response = responses[0]
    const daily = response.daily()!
    if (!daily) {
      throw new WeatherApiError('No daily data in forecast response')
    }

    // 0=temp_max, 1=temp_min, 2=precip_prob_max, 3=wind_max
    const tempMaxArray = daily.variables(0)!.valuesArray()
    const tempMinArray = daily.variables(1)!.valuesArray()
    const precipProbMaxArray = daily.variables(2)!.valuesArray()
    const windMaxArray = daily.variables(3)!.valuesArray()
    const relativeHumidityArray = daily.variables(4)!.valuesArray()

    if (
      !tempMaxArray ||
      !tempMinArray ||
      !precipProbMaxArray ||
      !windMaxArray ||
      !relativeHumidityArray
    ) {
      throw new WeatherApiError('Missing weather data arrays')
    }

    const validated = forecastResponseSchema.parse({
      daily: {
        time: [
          ...Array(
            (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval(),
          ),
        ].map((_, i) =>
          new Date(
            (Number(daily.time()) + i * daily.interval()) * 1000,
          ).toISOString(),
        ),
        temperature_2m_max: Array.from(tempMaxArray),
        temperature_2m_min: Array.from(tempMinArray),
        precipitation_probability_max: Array.from(precipProbMaxArray),
        wind_speed_10m_max: Array.from(windMaxArray),
        relative_humidity_2m_mean: Array.from(relativeHumidityArray),
      },
    })

    return validated
  }

  async getHistorical(
    lat: number,
    lon: number,
    targetDate: string,
    tz: string,
    yearsBack = 10,
  ): Promise<HistoricalResponse> {
    const target = parseISO(targetDate)
    const currentYear = getYear(target)
    const historicalData: Array<{
      time: string
      temperature_2m_max: number
      temperature_2m_min: number
      precipitation_sum: number
      wind_speed_10m_max: number
      relative_humidity_2m_mean: number
    }> = []

    // fetch single day per year in parallel
    const promises: Promise<void>[] = []
    for (let y = currentYear - yearsBack; y < currentYear; y++) {
      const yearDate = format(setYear(target, y), 'yyyy-MM-dd')
      promises.push(
        (async () => {
          const params = {
            latitude: lat,
            longitude: lon,
            timezone: tz,
            start_date: yearDate,
            end_date: yearDate,
            wind_speed_unit: 'mph',
            temperature_unit: 'fahrenheit',
            precipitation_unit: 'inch',
            daily: [
              'temperature_2m_max',
              'temperature_2m_min',
              'precipitation_sum',
              'wind_speed_10m_max',
              'relative_humidity_2m_mean',
            ],
          }

          const responses = await fetchWeatherApi(this.archiveUrl, params)

          if (responses.length === 0) {
            throw new WeatherApiError(`No historical response for ${yearDate}`)
          }

          const response = responses[0]
          const daily = response.daily()!
          if (!daily) {
            throw new WeatherApiError(`No daily data for ${yearDate}`)
          }

          const ts = Number(daily.time())
          const date = new Date(ts * 1000)
          historicalData.push({
            time: date.toISOString(),
            temperature_2m_max: daily.variables(0)!.value()!,
            temperature_2m_min: daily.variables(1)!.value()!,
            precipitation_sum: daily.variables(2)!.value()!,
            wind_speed_10m_max: daily.variables(3)!.value()!,
            relative_humidity_2m_mean: daily.variables(4)!.value()!,
          })
        })(),
      )
    }

    await Promise.all(promises)

    // sort by date to ensure chronological order
    historicalData.sort((a, b) => a.time.localeCompare(b.time))

    const validated = historicalResponseSchema.parse({
      daily: {
        time: historicalData.map((d) => d.time),
        temperature_2m_max: historicalData.map((d) => d.temperature_2m_max),
        temperature_2m_min: historicalData.map((d) => d.temperature_2m_min),
        precipitation_sum: historicalData.map((d) => d.precipitation_sum),
        wind_speed_10m_max: historicalData.map((d) => d.wind_speed_10m_max),
        relative_humidity_2m_mean: historicalData.map(
          (d) => d.relative_humidity_2m_mean,
        ),
      },
    })

    return validated
  }
}
