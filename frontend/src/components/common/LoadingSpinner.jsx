export default function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className="flex items-center justify-center p-12">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} absolute rounded-full border-2 border-border`} />
        <div className={`${sizes[size]} absolute animate-spin rounded-full border-2 border-t-amber-400 border-r-transparent border-b-transparent border-l-transparent drop-shadow-[0_0_4px_rgba(245,158,11,0.3)]`} />
      </div>
    </div>
  )
}
