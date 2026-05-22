import { LucideIcon } from 'lucide-react'

interface MetricsBadgeProps {
  icon: LucideIcon
  label: string
  value: string | number
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
}

const BG: Record<NonNullable<MetricsBadgeProps['color']>, string> = {
  blue:   'bg-blue-50 dark:bg-blue-900/20',
  green:  'bg-green-50 dark:bg-green-900/20',
  yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
  red:    'bg-red-50 dark:bg-red-900/20',
  gray:   'bg-gray-100 dark:bg-gray-700/30',
}

const TEXT: Record<NonNullable<MetricsBadgeProps['color']>, string> = {
  blue:   'text-blue-600 dark:text-blue-400',
  green:  'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red:    'text-red-600 dark:text-red-400',
  gray:   'text-gray-500 dark:text-gray-400',
}

const MetricsBadge = ({ icon: Icon, label, value, color = 'blue' }: MetricsBadgeProps) => (
  <div className={`flex flex-col items-center rounded-lg p-2 ${BG[color]}`}>
    <div className={`flex items-center gap-1 font-semibold text-sm ${TEXT[color]}`}>
      <Icon size={14} />
      <span>{value}</span>
    </div>
    <span className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{label}</span>
  </div>
)

export default MetricsBadge