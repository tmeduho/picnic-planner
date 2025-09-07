import { LRUCache } from 'lru-cache'

export const weatherCache = new LRUCache<string, any>({
  max: 500,
  ttl: 3600 * 1000,
  allowStale: false,
})

export function setWithTTL(key: string, value: any, ttlMs?: number) {
  weatherCache.set(key, value, { ttl: ttlMs || 3600 * 1000 })
}
