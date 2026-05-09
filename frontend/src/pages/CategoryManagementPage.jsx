import { useState, useEffect } from 'react'
import { getCategories, createCategorie, updateCategorie, deleteCategorie } from '@/api/categories'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ libelle: '', description: '' })

  const fetchCategories = () => getCategories().then(setCategories)

  useEffect(() => {
    fetchCategories().finally(() => setLoading(false))
  }, [])

  const openCreate = () => { setEditing(null); setForm({ libelle: '', description: '' }); setModalOpen(true) }
  const openEdit = (cat) => { setEditing(cat); setForm({ libelle: cat.libelle, description: cat.description || '' }); setModalOpen(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await updateCategorie(editing.idCategorie, form)
      toast.success('Catégorie modifiée')
    } else {
      await createCategorie(form)
      toast.success('Catégorie créée')
    }
    await fetchCategories()
    setModalOpen(false)
  }

  const handleDelete = async () => {
    try {
      await deleteCategorie(deleteTarget.idCategorie)
      await fetchCategories()
      toast.success('Catégorie supprimée')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Impossible de supprimer cette catégorie')
    }
    setDeleteTarget(null)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Catégories</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{categories.length} catégorie{categories.length !== 1 ? 's' : ''}</p>
        </div>
        <Button size="sm" onClick={openCreate}>Nouvelle catégorie</Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="Aucune catégorie" />
      ) : (
        <div className="rounded-xl border border-border/50 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Libellé</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Description</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Incidents</th>
                  <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.idCategorie} className="border-b border-border/30 text-sm hover:bg-card/40 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium">{c.libelle}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.description || '—'}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{c.incidentCount || 0}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openEdit(c)}>Modifier</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => setDeleteTarget(c)}>Supprimer</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Modifier' : 'Créer'} une catégorie</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Libellé</Label>
              <Input className="h-9 bg-background/50 border-border/60 text-xs" value={form.libelle} onChange={(e) => setForm({ ...form, libelle: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Textarea className="bg-background/50 border-border/60 text-xs resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>Annuler</Button>
              <Button type="submit">{editing ? 'Modifier' : 'Créer'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => { if (!v) setDeleteTarget(null) }}
        title="Supprimer la catégorie"
        description={`Êtes-vous sûr de vouloir supprimer "${deleteTarget?.libelle}" ?`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
      />
    </div>
  )
}
