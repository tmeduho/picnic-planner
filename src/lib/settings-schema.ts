import { z } from 'zod'

export const settingsSchema = z.object({
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    name: z.string(),
  }),
  weatherPreferences: z.object({
    idealTempMin: z.number().min(-50).max(120),
    idealTempMax: z.number().min(-50).max(120),
    fairTempMin: z.number().min(-50).max(120),
    fairTempMax: z.number().min(-50).max(120),
    maxPrecipitationChance: z.number().min(0).max(100),
    maxWindSpeed: z.number().min(0).max(200),
    humidityThreshold: z.number().min(0).max(100),
  }),
})

export type Settings = z.infer<typeof settingsSchema>

export const defaultSettings: Settings = {
  location: {
    latitude: 40.4387,
    longitude: -79.9972,
    name: 'Pittsburgh',
  },
  weatherPreferences: {
    idealTempMin: 60,
    idealTempMax: 80,
    fairTempMin: 50,
    fairTempMax: 90,
    maxPrecipitationChance: 25,
    maxWindSpeed: 15,
    humidityThreshold: 75,
  },
}
