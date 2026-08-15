import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    || (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api` : '/api'),
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — but skip redirect on auth pages themselves
// (wrong password on /login returns 401, we don't want a hard redirect there)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const currentPath = window.location.pathname
      const isAuthPage = currentPath === '/login' || currentPath === '/signup'
      if (!isAuthPage) {
        localStorage.removeItem('cc_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
