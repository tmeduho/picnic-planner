import {
  IWeatherProvider,
  ForecastResponse,
  HistoricalResponse,
  WeatherApiError,
  forecastResponseSchema,
  historicalResponseSchema,
} from '../../types/weather'
import { fetchWeatherApi } from 'openmeteo'
import { parseISO, format, getMonth, getDate, subYears } from 'date-fns'

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

    // 0=temp_max, 1=temp_min, 2=precip_prob_max, 3=wind_max, 4=humidity_mean
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
    const targetMonth = getMonth(target)
    const targetDay = getDate(target)

    const startDate = format(subYears(target, yearsBack), 'yyyy-MM-dd')
    const endDate = format(subYears(target, 1), 'yyyy-MM-dd')

    const params = {
      latitude: lat,
      longitude: lon,
      timezone: tz,
      start_date: startDate,
      end_date: endDate,
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
      throw new WeatherApiError(
        `No historical response for date range ${startDate} to ${endDate}`,
      )
    }

    const response = responses[0]
    const daily = response.daily()
    if (!daily) {
      throw new WeatherApiError(
        `No daily data for date range ${startDate} to ${endDate}`,
      )
    }

    // 0=temp_max, 1=temp_min, 2=precip_sum, 3=wind_max, 4=humidity_mean
    const tempMaxArray = daily.variables(0)?.valuesArray()
    const tempMinArray = daily.variables(1)?.valuesArray()
    const precipSumArray = daily.variables(2)?.valuesArray()
    const windMaxArray = daily.variables(3)?.valuesArray()
    const humidityArray = daily.variables(4)?.valuesArray()

    if (
      !tempMaxArray ||
      !tempMinArray ||
      !precipSumArray ||
      !windMaxArray ||
      !humidityArray
    ) {
      throw new WeatherApiError('Missing historical data arrays')
    }

    const times: string[] = []
    const temperatureMaxList: number[] = []
    const temperatureMinList: number[] = []
    const precipitationSumList: number[] = []
    const windSpeedMaxList: number[] = []
    const humidityMeanList: number[] = []

    const timeDataPoints = tempMaxArray.length
    for (let i = 0; i < timeDataPoints; i++) {
      const ts = Number(daily.time()) + i * daily.interval()
      const date = new Date(ts * 1000)
      if (date.getMonth() === targetMonth && date.getDate() === targetDay) {
        times.push(date.toISOString())
        temperatureMaxList.push(tempMaxArray[i] ?? 0)
        temperatureMinList.push(tempMinArray[i] ?? 0)
        precipitationSumList.push(precipSumArray[i] ?? 0)
        windSpeedMaxList.push(windMaxArray[i] ?? 0)
        humidityMeanList.push(humidityArray[i] ?? 0)
      }
    }

    const validated = historicalResponseSchema.parse({
      daily: {
        time: times,
        temperature_2m_max: temperatureMaxList,
        temperature_2m_min: temperatureMinList,
        precipitation_sum: precipitationSumList,
        wind_speed_10m_max: windSpeedMaxList,
        relative_humidity_2m_mean: humidityMeanList,
      },
    })

    return validated
  }
}
