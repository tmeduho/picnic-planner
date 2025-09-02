import { Link } from '@tanstack/react-router'
import { Sun, Cloud, CloudRain, Settings, Home } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-500 via-sky-400 to-blue-600 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-white/30 transition-all duration-200 group"
            >
              <div className="flex gap-1">
                <Sun className="h-5 w-5 text-yellow-300 group-hover:scale-110 transition-transform duration-200" />
                <Cloud className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
                <CloudRain className="h-5 w-5 text-blue-200 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-wide group-hover:text-yellow-100 transition-colors duration-200">
                Picnic Planner
              </h1>
            </Link>
          </div>

          <nav className="flex items-center gap-1">
            <Link
              to="/"
              activeProps={{
                className:
                  'bg-white/30 backdrop-blur-sm text-yellow-100 shadow-md',
              }}
              activeOptions={{ exact: true }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:bg-white/20 hover:backdrop-blur-sm group"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              to="/settings"
              activeProps={{
                className:
                  'bg-white/30 backdrop-blur-sm text-yellow-100 shadow-md',
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:bg-white/20 hover:backdrop-blur-sm group"
            >
              <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
