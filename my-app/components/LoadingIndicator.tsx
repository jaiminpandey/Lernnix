interface LoadingIndicatorProps {
    message: string
  }
  
  export function LoadingIndicator({ message }: LoadingIndicatorProps) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-600">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-400 border-t-transparent"></div>
            <p className="text-white text-sm">{message}</p>
          </div>
        </div>
      </div>
    )
  }
  
    export default LoadingIndicator  