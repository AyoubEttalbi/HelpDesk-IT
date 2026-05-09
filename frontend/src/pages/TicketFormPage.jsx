import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createIncident } from '@/api/incidents'
import { getCategories } from '@/api/categories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function TicketFormPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ titre: '', description: '', priorite: 'MOYEN', idCategorie: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.idCategorie) { setError('Veuillez sélectionner une catégorie'); return }
    setLoading(true)
    setError('')
    try {
      const incident = await createIncident({ ...form, idCategorie: Number(form.idCategorie) })
      navigate(`/tickets/${incident.idIncident}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight" style={{ color: '#e8e6e0' }}>Nouvel incident</h1>
        <p className="mt-0.5 text-xs" style={{ color: 'rgba(232,230,224,0.45)' }}>Signaler un problème technique</p>
      </div>

      <div className="rounded-xl p-6" style={{ background: 'var(--card)', border: '1px solid rgba(255,255,255,0.10)' }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg px-3 py-2 text-xs" style={{ background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(220,38,38,0.20)', color: '#dc2626' }}>
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="titre">Titre</Label>
            <Input id="titre" className="h-9 text-sm" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={5} className="text-sm resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priorité</Label>
              <Select value={form.priorite} onValueChange={(v) => setForm({ ...form, priorite: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FAIBLE">Faible</SelectItem>
                  <SelectItem value="MOYEN">Moyen</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                  <SelectItem value="CRITIQUE">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={form.idCategorie} onValueChange={(v) => setForm({ ...form, idCategorie: v })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.idCategorie} value={String(c.idCategorie)}>{c.libelle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? 'Création...' : "Créer l'incident"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => navigate('/tickets')}>Annuler</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
