const statusColors = {
  OUVERT: { label: 'Ouvert', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.10)', border: 'rgba(59, 130, 246, 0.20)' },
  EN_COURS: { label: 'En cours', color: '#F97316', bg: 'rgba(249, 115, 22, 0.10)', border: 'rgba(249, 115, 22, 0.20)' },
  EN_ATTENTE: { label: 'En attente', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.10)', border: 'rgba(139, 92, 246, 0.20)' },
  RESOLU: { label: 'Résolu', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.10)', border: 'rgba(34, 197, 94, 0.20)' },
  CLOS: { label: 'Fermé', color: '#78716C', bg: 'rgba(120, 113, 108, 0.10)', border: 'rgba(120, 113, 108, 0.20)' },
}

const priorityConfig = {
  FAIBLE: { label: 'Faible', color: '#78716C', bg: 'rgba(120, 113, 108, 0.08)' },
  MOYEN: { label: 'Moyen', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.10)' },
  URGENT: { label: 'Urgent', color: '#F97316', bg: 'rgba(249, 115, 22, 0.10)' },
  CRITIQUE: { label: 'Critique', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.10)' },
}

export function StatusBadge({ statut }) {
  const cfg = statusColors[statut] || { label: statut, color: '#78716C', bg: 'transparent', border: 'transparent' }
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
      style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border || cfg.bg}`, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

export function PriorityBadge({ priorite }) {
  const cfg = priorityConfig[priorite] || { label: priorite, color: '#78716C', bg: 'transparent' }
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}
