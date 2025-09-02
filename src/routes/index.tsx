import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      <span className="text-2xl font-bold">Picnic Planner</span>
    </div>
  )
}
