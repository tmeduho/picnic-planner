import { defaultSettings, settingsSchema } from './settings-schema'
import type { Settings } from './settings-schema'

const SETTINGS_KEY = 'picnic-preferences'

export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (!stored) {
      return defaultSettings
    }

    const parsed = JSON.parse(stored)
    const validated = settingsSchema.parse(parsed)
    return validated
  } catch (error) {
    console.warn('Failed to load settings, using defaults:', error)
    return defaultSettings
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

export function resetSettings(): Settings {
  saveSettings(defaultSettings)
  return defaultSettings
}
