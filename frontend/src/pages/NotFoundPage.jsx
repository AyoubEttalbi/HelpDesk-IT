import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-7xl font-bold tracking-tight text-amber-400/60 drop-shadow-[0_0_20px_rgba(251,191,36,0.15)]">404</h1>
      <p className="text-sm text-muted-foreground">Page non trouvée</p>
      <Button asChild variant="outline" size="sm">
        <Link to="/dashboard">Retour</Link>
      </Button>
    </div>
  )
}
