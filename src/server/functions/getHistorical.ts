import { weatherCache, setWithTTL } from '../cache'
import { weatherProvider } from '../weather-provider'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

const paramsSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  date: z.string(),
  tz: z.string(),
})

export const getHistorical = createServerFn({ method: 'POST' })
  .validator((input: unknown) => paramsSchema.parse(input))
  .handler(async (ctx) => {
    const { lat, lon, date, tz } = ctx.data

    const cacheKey = `historical:${lat.toFixed(4)}:${lon.toFixed(4)}:${date}:${tz}`
    let data = weatherCache.get(cacheKey)

    if (data === undefined) {
      data = await weatherProvider.getHistorical(lat, lon, date, tz, 10)
      setWithTTL(cacheKey, data, 24 * 3600 * 1000)
    }

    return data
  })
