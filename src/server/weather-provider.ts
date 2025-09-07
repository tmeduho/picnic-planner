import { IWeatherProvider } from '../types/weather'
import { OpenMeteoProvider } from './providers/open-meteo-provider'

export function createWeatherProvider(): IWeatherProvider {
  const providerName = process.env.WEATHER_PROVIDER || 'OpenMeteo'
  switch (providerName) {
    case 'OpenMeteo':
      return new OpenMeteoProvider()
    // case 'OpenWeather':
    //   return new OpenWeatherProvider();
    // case 'Mock':
    //   return new MockProvider();
    default:
      throw new Error(`Unsupported provider: ${providerName}`)
  }
}

export const weatherProvider = createWeatherProvider()
