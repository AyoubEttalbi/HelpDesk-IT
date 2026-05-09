import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function UserFormModal({ open, onOpenChange, user, onSubmit }) {
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', motDePasse: '', role: 'USER', departement: '', specialite: '', disponibilite: true })

  useEffect(() => {
    if (user) {
      setForm({ nom: user.nom, prenom: user.prenom, email: user.email, motDePasse: '', role: user.role, departement: user.departement || '', specialite: user.specialite || '', disponibilite: user.disponibilite })
    } else {
      setForm({ nom: '', prenom: '', email: '', motDePasse: '', role: 'USER', departement: '', specialite: '', disponibilite: true })
    }
  }, [user, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...form }
    if (!data.motDePasse) delete data.motDePasse
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Modifier' : 'Créer'} un utilisateur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-xs">Nom</Label>
              <Input id="nom" className="bg-background/50 border-border/60 text-xs h-9" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom" className="text-xs">Prénom</Label>
              <Input id="prenom" className="bg-background/50 border-border/60 text-xs h-9" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input id="email" type="email" className="bg-background/50 border-border/60 text-xs h-9" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motDePasse" className="text-xs">{user ? 'Nouveau mot de passe (vide = inchangé)' : 'Mot de passe'}</Label>
            <Input id="motDePasse" type="password" className="bg-background/50 border-border/60 text-xs h-9" value={form.motDePasse} onChange={(e) => setForm({ ...form, motDePasse: e.target.value })} required={!user} minLength={8} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs">Rôle</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger className="bg-background/50 border-border/60 text-xs h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Utilisateur</SelectItem>
                  <SelectItem value="TECHNICIAN">Technicien</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="departement" className="text-xs">Département</Label>
              <Input id="departement" className="bg-background/50 border-border/60 text-xs h-9" value={form.departement} onChange={(e) => setForm({ ...form, departement: e.target.value })} />
            </div>
          </div>
          {form.role === 'TECHNICIAN' && (
            <div className="space-y-2">
              <Label htmlFor="specialite" className="text-xs">Spécialité</Label>
              <Input id="specialite" className="bg-background/50 border-border/60 text-xs h-9" value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit">{user ? 'Modifier' : 'Créer'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
