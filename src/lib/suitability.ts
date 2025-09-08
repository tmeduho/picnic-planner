import { Settings } from './settings-schema'

export type Suitability = 'ideal' | 'fair' | 'poor'

export interface DayConditions {
  maxTempF: number
  minTempF: number
  precipitationChancePct: number
  maxWindMph: number
  humidityMeanPct: number
}

export function classifySuitability(
  conditions: DayConditions,
  settings: Settings,
): Suitability {
  const prefs = settings.weatherPreferences

  const withinIdealTemp =
    conditions.maxTempF <= prefs.idealTempMax &&
    conditions.minTempF >= prefs.idealTempMin

  const withinFairTemp =
    conditions.maxTempF <= prefs.fairTempMax &&
    conditions.minTempF >= prefs.fairTempMin

  const precipOk =
    conditions.precipitationChancePct <= prefs.maxPrecipitationChance
  const windOk = conditions.maxWindMph <= prefs.maxWindSpeed
  const humidityOk = conditions.humidityMeanPct <= prefs.humidityThreshold

  if (withinIdealTemp && precipOk && windOk && humidityOk) return 'ideal'
  if (withinFairTemp && precipOk && windOk && humidityOk) return 'fair'
  return 'poor'
}

export function suitabilityToClasses(suitability: Suitability): string {
  switch (suitability) {
    case 'ideal':
      return 'border-green-300 bg-green-50'
    case 'fair':
      return 'border-yellow-300 bg-yellow-50'
    case 'poor':
    default:
      return 'border-red-300 bg-red-50'
  }
}
