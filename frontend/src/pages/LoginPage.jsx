import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@helpdesk.com')
  const [motDePasse, setMotDePasse] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, motDePasse)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute left-1/2 top-1/3 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: 'rgba(232, 160, 32, 0.05)' }}
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            <span style={{ color: '#E8A020' }}>HelpDesk</span>
            <span style={{ color: 'rgba(232,230,224,0.45)' }}> IT</span>
          </h1>
          <p className="mt-2 text-xs" style={{ color: 'rgba(232,230,224,0.35)' }}>Gestion des incidents</p>
        </div>

        <div className="rounded-xl p-6" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(220,38,38,0.20)', color: '#dc2626' }}>
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-sm" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} className="h-9 text-sm" required />
            </div>
            <Button type="submit" className="w-full h-9 text-sm font-bold" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-[10px]" style={{ color: 'rgba(232,230,224,0.15)' }}>
          EMSI · Projet Génie Informatique
        </p>
      </div>
    </div>
  )
}
