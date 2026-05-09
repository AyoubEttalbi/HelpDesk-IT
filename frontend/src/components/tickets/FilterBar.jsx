import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STATUT_OPTIONS = [
  { value: 'OUVERT', label: 'Ouvert' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'RESOLU', label: 'Résolu' },
  { value: 'CLOS', label: 'Fermé' },
]

const PRIORITE_OPTIONS = [
  { value: 'FAIBLE', label: 'Faible' },
  { value: 'MOYEN', label: 'Moyen' },
  { value: 'URGENT', label: 'Urgent' },
  { value: 'CRITIQUE', label: 'Critique' },
]

export default function FilterBar({ filters, onChange, categories }) {
  const update = (key, value) => onChange({ ...filters, [key]: value })

  const statutVal = filters.statut || undefined
  const prioriteVal = filters.priorite || undefined
  const categorieVal = filters.idCategorie || undefined

  return (
    <div className="flex flex-wrap gap-2">
      <Input
        placeholder="Rechercher..."
        value={filters.search || ''}
        onChange={(e) => update('search', e.target.value)}
        className="h-9 w-56 text-sm"
      />
      <Select value={statutVal} onValueChange={(v) => update('statut', v)}>
        <SelectTrigger className="h-9 w-32 text-sm"><SelectValue placeholder="Statut" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous</SelectItem>
          {STATUT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={prioriteVal} onValueChange={(v) => update('priorite', v)}>
        <SelectTrigger className="h-9 w-32 text-sm"><SelectValue placeholder="Priorité" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="">Toutes</SelectItem>
          {PRIORITE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={categorieVal} onValueChange={(v) => update('idCategorie', v)}>
        <SelectTrigger className="h-9 w-40 text-sm"><SelectValue placeholder="Catégorie" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="">Toutes</SelectItem>
          {categories.length === 0 ? (
            <SelectItem value="__loading" disabled>Chargement...</SelectItem>
          ) : (
            categories.map((c) => (
              <SelectItem key={c.idCategorie} value={String(c.idCategorie)}>{c.libelle}</SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}
