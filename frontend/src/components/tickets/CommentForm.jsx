import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function CommentForm({ onSubmit }) {
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!contenu.trim()) return
    setLoading(true)
    try {
      await onSubmit(contenu)
      setContenu('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        placeholder="Ajouter un commentaire..."
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        rows={3}
        className="bg-background/50 border-border/60 text-xs placeholder:text-muted-foreground/50"
      />
      <Button type="submit" size="sm" disabled={loading || !contenu.trim()}>
        {loading ? 'Envoi...' : 'Commenter'}
      </Button>
    </form>
  )
}
