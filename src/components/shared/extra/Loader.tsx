import { Loader2 } from "lucide-react"

export const LoadingSpinner = () => (
  <main className="w-full pt-24 md:pt-28 pb-10 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg border border-gray-200 flex flex-col items-center">
      <Loader2 className="h-10 w-10 text-indigo-600 animate-spin mb-2" />
      <p className="text-gray-900">Loading building data...</p>
    </div>
  </main>
)
