import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-sky-500 mb-4">404</h1>
        <h2 className="text-2xl mb-4">Page Not Found</h2>
        <p className="text-lg mb-8 text-gray-600">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
