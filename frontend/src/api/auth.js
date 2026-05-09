import api from './axios'

export const login = (email, motDePasse) =>
  api.post('/auth/login', { email, motDePasse }).then((res) => res.data)

export const register = (data) =>
  api.post('/auth/register', data).then((res) => res.data)
