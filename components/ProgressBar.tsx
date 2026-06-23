interface Props {
  value: number
  className?: string
}

export default function ProgressBar({ value, className = '' }: Props) {
  return (
    <div className={`w-full rounded-full h-2 ${className}`} style={{ background: '#334155' }}>
      <div
        className="h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: '#3b82f6' }}
      />
    </div>
  )
}
