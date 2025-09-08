export function FullScreenMessage({
  message,
  messageClassName,
}: {
  message: string
  messageClassName?: string
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <p className={messageClassName ?? 'text-gray-600'}>{message}</p>
        </div>
      </div>
    </div>
  )
}
