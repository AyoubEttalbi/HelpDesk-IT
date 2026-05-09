const dotColors = {
  OUVERT: 'bg-blue-400 shadow-[0_0_6px_rgba(59,130,246,0.4)]',
  EN_COURS: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.4)]',
  EN_ATTENTE: 'bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,0.4)]',
  RESOLU: 'bg-emerald-400 shadow-[0_0_6px_rgba(34,197,94,0.4)]',
  CLOS: 'bg-muted-foreground',
}

export default function StatusTimeline({ historique }) {
  return (
    <div className="space-y-0">
      {historique.map((h, i) => (
        <div key={h.idHistorique} className="relative flex gap-4 pb-8 last:pb-0">
          <div className="flex flex-col items-center">
            <div className={`z-10 h-2.5 w-2.5 rounded-full ring-2 ring-background ${dotColors[h.nouveauStatut] || 'bg-muted-foreground'}`} />
            {i < historique.length - 1 && <div className="mt-0.5 h-full w-px bg-border/50" />}
          </div>
          <div className="flex-1 pt-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {h.nouveauStatut === 'OUVERT' && !h.ancienStatut ? 'Création' : `${h.ancienStatut || '—'} → ${h.nouveauStatut}`}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {h.auteur?.prenom} {h.auteur?.nom} · {new Date(h.dateChangement).toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
