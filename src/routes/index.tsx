import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Plan Your Perfect Picnic
          </h2>
          <p className="text-lg text-gray-600">
            Choose the best weather for your time outdoors
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Two-Week Weather Forecast
          </h3>
          <p className="text-gray-600">TODO: Calendar component here..</p>
        </div>
      </div>
    </div>
  )
}
