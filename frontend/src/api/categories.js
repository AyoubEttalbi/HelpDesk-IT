import api from './axios'

export const getCategories = () =>
  api.get('/categories').then((r) =>
    r.data.map((item) => ({ ...item.categorie, incidentCount: item.incidentCount }))
  )

export const createCategorie = (data) =>
  api.post('/categories', data).then((r) => r.data)

export const updateCategorie = (id, data) =>
  api.put(`/categories/${id}`, data).then((r) => r.data)

export const deleteCategorie = (id) =>
  api.delete(`/categories/${id}`).then((r) => r.data)
