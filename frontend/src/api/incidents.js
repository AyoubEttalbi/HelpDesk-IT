import api from './axios'

export const getIncidents = (params) =>
  api.get('/incidents', { params }).then((r) => r.data)

export const getIncidentById = (id) =>
  api.get(`/incidents/${id}`).then((r) => r.data)

export const createIncident = (data) =>
  api.post('/incidents', data).then((r) => r.data)

export const updateStatut = (id, statut) =>
  api.put(`/incidents/${id}/statut`, { statut }).then((r) => r.data)

export const assignTechnicien = (id, idTechnicien) =>
  api.put(`/incidents/${id}/assigner`, { idTechnicien }).then((r) => r.data)

export const addCommentaire = (id, contenu) =>
  api.post(`/incidents/${id}/commentaires`, { contenu }).then((r) => r.data)

export const deleteIncident = (id) =>
  api.delete(`/incidents/${id}`).then((r) => r.data)
