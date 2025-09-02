import { createFileRoute } from '@tanstack/react-router'
import { SettingsForm } from '../components/settings-form'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Settings</h2>
          <p className="text-lg text-gray-600">
            Customize your weather preferences for the perfect picnic experience
          </p>
        </div>

        <SettingsForm />
      </div>
    </div>
  )
}
