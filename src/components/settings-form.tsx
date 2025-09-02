import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { defaultSettings, settingsSchema } from '../lib/settings-schema'
import { loadSettings, saveSettings } from '../lib/settings-storage'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAppForm } from '@/hooks/form'

export function SettingsForm() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // only load settings on client side, after component is mounted
  useEffect(() => {
    const loadedSettings = loadSettings()
    setSettings(loadedSettings)
    setIsLoaded(true)
  }, [])

  const form = useAppForm({
    defaultValues: settings,
    validators: {
      onChange: settingsSchema,
    },
    onSubmit: async ({ value }) => {
      const result = settingsSchema.safeParse(value)
      if (!result.success) {
        toast.error('Please check your input values')
        return
      }

      saveSettings(value)
      toast.success('Settings saved successfully!')
      navigate({ to: '/' })
    },
  })

  useEffect(() => {
    if (isLoaded) {
      form.reset(settings)
    }
  }, [isLoaded, settings, form])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-8"
    >
      <Card>
        <CardHeader>
          <CardTitle>Location Settings</CardTitle>
          <CardDescription>
            Set your preferred location for weather forecasts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form.AppField
            name="location.name"
            children={(field) => (
              <field.TextField
                label="Location Name"
                type="text"
                placeholder="Enter location name"
              />
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.AppField
              name="location.latitude"
              children={(field) => (
                <field.TextField
                  label="Latitude"
                  type="number"
                  placeholder="-90 to 90"
                />
              )}
            />
            <form.AppField
              name="location.longitude"
              children={(field) => (
                <field.TextField
                  label="Longitude"
                  type="number"
                  placeholder="-180 to 180"
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weather Preferences</CardTitle>
          <CardDescription>
            Customize your ideal weather conditions for picnics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">
              Temperature Ranges (°F)
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.AppField
                  name="weatherPreferences.idealTempMin"
                  children={(field) => (
                    <field.TextField
                      label="Ideal Min Temperature"
                      type="number"
                      placeholder="60"
                    />
                  )}
                />

                <form.AppField
                  name="weatherPreferences.idealTempMax"
                  children={(field) => (
                    <field.TextField
                      label="Ideal Max Temperature"
                      type="number"
                      placeholder="80"
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.AppField
                  name="weatherPreferences.fairTempMin"
                  children={(field) => (
                    <field.TextField
                      label="Fair Min Temperature"
                      type="number"
                      placeholder="50"
                    />
                  )}
                />

                <form.AppField
                  name="weatherPreferences.fairTempMax"
                  children={(field) => (
                    <field.TextField
                      label="Fair Max Temperature"
                      type="number"
                      placeholder="86"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Weather Conditions</h4>
            <div className="space-y-4">
              <form.AppField
                name="weatherPreferences.maxPrecipitationChance"
                children={(field) => (
                  <field.Slider label="Max Precipitation Chance (%)" unit="%" />
                )}
              />

              <form.AppField
                name="weatherPreferences.maxWindSpeed"
                children={(field) => (
                  <field.Slider label="Max Wind Speed (mph)" unit=" mph" />
                )}
              />

              <form.AppField
                name="weatherPreferences.humidityThreshold"
                children={(field) => (
                  <field.Slider label="Max Humidity (%)" unit="%" />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <form.AppForm>
          <form.SubscribeButton label="Save Settings" />
        </form.AppForm>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset(defaultSettings)
            saveSettings(defaultSettings)
            toast.success('Settings reset to defaults!')
          }}
        >
          Reset to Defaults
        </Button>
      </div>
    </form>
  )
}
