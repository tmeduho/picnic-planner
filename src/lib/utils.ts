import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type Settings } from './settings-schema'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch (error) {
    console.warn('Could not detect timezone, falling back to UTC:', error)
    return 'UTC'
  }
}

export const getLocationDisplay = (settings: Settings | null): string => {
  if (!settings) return 'Loading location...'
  const { location } = settings
  return location.name || `${location.latitude}, ${location.longitude}`
}
