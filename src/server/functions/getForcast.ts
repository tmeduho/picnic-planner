import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import { weatherProvider } from '../weather-provider'
import { setWithTTL, weatherCache } from '../cache'

const paramsSchema = z.object({
  lat: z.number().refine((v) => v >= -90 && v <= 90),
  lon: z.number().refine((v) => v >= -180 && v <= 180),
  tz: z.string(),
})

export const getForecast = createServerFn({ method: 'POST' })
  .validator((input: unknown) => paramsSchema.parse(input))
  .handler(async (ctx) => {
    const { lat, lon, tz } = ctx.data

    const cacheKey = `forecast:${lat.toFixed(4)}:${lon.toFixed(4)}:${tz}`
    let data = weatherCache.get(cacheKey)

    if (data === undefined) {
      data = await weatherProvider.getForecast(lat, lon, tz)
      setWithTTL(cacheKey, data)
    }

    return data
  })
