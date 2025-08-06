"use client"

interface ProductsReportProps {
  title?: string
  data?: {
    thisDay: number
    thisWeek: number
    thisMonth: number
  }
}

export function ProductsReport({
  title = "Total New Products Report",
  data = { thisDay: 30, thisWeek: 60, thisMonth: 85 },
}: ProductsReportProps) {
  return (
    <div className="bg-white dark:bg-gray-500 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-black mb-6">{title}</h2>

      <div className="flex items-start justify-between ">
        {/* Circular Chart */}
        <div className="w-full flex items-center justify-center">
          <div className="relative w-[430px] h-[430px]">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background circles */}
            <circle cx="100" cy="100" r="85" fill="none" stroke="#f1f5f9" strokeWidth="12" />
            <circle cx="100" cy="100" r="65" fill="none" stroke="#e2e8f0" strokeWidth="12" />
            <circle cx="100" cy="100" r="45" fill="none" stroke="#cbd5e1" strokeWidth="12" />

            {/* Outer ring - This Month */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="url(#gradient-purple)"
              strokeWidth="12"
              strokeDasharray={`${data.thisMonth * 5.34} 534`}
              strokeLinecap="round"
            />

            {/* Middle ring - This Week */}
            <circle
              cx="100"
              cy="100"
              r="65"
              fill="none"
              stroke="url(#gradient-blue)"
              strokeWidth="12"
              strokeDasharray={`${data.thisWeek * 4.08} 408`}
              strokeLinecap="round"
            />

            {/* Inner ring - This Day */}
            <circle
              cx="100"
              cy="100"
              r="45"
              fill="none"
              stroke="url(#gradient-light-blue)"
              strokeWidth="12"
              strokeDasharray={`${data.thisDay * 2.83} 283`}
              strokeLinecap="round"
            />

            <defs>
              <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="gradient-light-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        </div>

        {/* Legend */}
        <div className=" flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">This day</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <span className="text-sm text-gray-600">This Week</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-600"></div>
            <span className="text-sm text-gray-600">This Month</span>
          </div>
        </div>
      </div>
    </div>
  )
}
