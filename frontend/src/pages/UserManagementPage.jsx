import { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '@/api/users'
import { useAuth } from '@/context/AuthContext'
import UserTable from '@/components/users/UserTable'
import UserFormModal from '@/components/users/UserFormModal'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import EmptyState from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function UserManagementPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchUsers = () => getUsers().then(setUsers)

  useEffect(() => {
    fetchUsers().finally(() => setLoading(false))
  }, [])

  const filtered = users.filter((u) =>
    `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (data) => {
    await createUser(data)
    await fetchUsers()
    setModalOpen(false)
    toast.success('Utilisateur créé')
  }

  const handleUpdate = async (data) => {
    await updateUser(editingUser.idUser, data)
    await fetchUsers()
    setModalOpen(false)
    setEditingUser(null)
    toast.success('Utilisateur modifié')
  }

  const handleDelete = async () => {
    if (deleteTarget.idUser === currentUser?.idUser) {
      toast.error('Vous ne pouvez pas vous supprimer')
      setDeleteTarget(null)
      return
    }
    await deleteUser(deleteTarget.idUser)
    await fetchUsers()
    setDeleteTarget(null)
    toast.success('Utilisateur supprimé')
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{users.length} utilisateur{users.length !== 1 ? 's' : ''}</p>
        </div>
        <Button size="sm" onClick={() => { setEditingUser(null); setModalOpen(true) }}>
          Nouvel utilisateur
        </Button>
      </div>

      <Input
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs h-9 bg-card border-border/60 text-xs"
      />

      {filtered.length === 0 ? (
        <EmptyState title="Aucun utilisateur" />
      ) : (
        <div className="rounded-xl border border-border/50 bg-card">
          <UserTable users={filtered} onEdit={(u) => { setEditingUser(u); setModalOpen(true) }} onDelete={setDeleteTarget} />
        </div>
      )}

      <UserFormModal open={modalOpen} onOpenChange={(v) => { setModalOpen(v); if (!v) setEditingUser(null) }} user={editingUser} onSubmit={editingUser ? handleUpdate : handleCreate} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => { if (!v) setDeleteTarget(null) }}
        title="Supprimer l'utilisateur"
        description={`Êtes-vous sûr de vouloir supprimer ${deleteTarget?.prenom} ${deleteTarget?.nom} ?`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
      />
    </div>
  )
}
