import { useEffect, useState } from 'react'
import { loadSettings } from '../lib/settings-storage'
import { getUserTimezone } from '../lib/utils'
import type { Settings } from '../lib/settings-schema'

export function useWeatherSettings() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [userTimezone, setUserTimezone] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadWeatherSettings = async () => {
      setIsLoading(true)

      const userSettings = loadSettings()
      setSettings(userSettings)

      const timezone = getUserTimezone()
      setUserTimezone(timezone)

      setIsLoading(false)
    }

    loadWeatherSettings()
  }, [])

  return {
    settings,
    userTimezone,
    isLoading,
    isReady: !!settings && !!userTimezone && !isLoading,
  }
}
