export default function CommentList({ commentaires }) {
  if (!commentaires?.length) {
    return <p className="py-6 text-center text-xs text-muted-foreground">Aucun commentaire.</p>
  }
  return (
    <div className="space-y-3">
      {commentaires.map((c) => (
        <div key={c.idCommentaire} className="rounded-lg border border-border/50 bg-background/50 p-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium">{c.auteur?.prenom} {c.auteur?.nom}</span>
            <span className="text-[10px] text-muted-foreground">{new Date(c.dateCommentaire).toLocaleString('fr-FR')}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{c.contenu}</p>
        </div>
      ))}
    </div>
  )
}
