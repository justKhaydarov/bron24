import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Inject access token + Accept-Language on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`

  const lang = localStorage.getItem('lang') || 'uz'
  config.headers['Accept-Language'] = lang

  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post('/api/auth/refresh/', { refresh })
          localStorage.setItem('access_token', data.access)
          localStorage.setItem('refresh_token', data.refresh)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  },
)

// ── Auth ──
export const sendOtp = (phone_number) => api.post('/auth/send-otp/', { phone_number })
export const verifyOtp = (phone_number, otp) => api.post('/auth/verify-otp/', { phone_number, otp })
export const getMe = () => api.get('/auth/me/')
export const updateMe = (data) => api.patch('/auth/me/', data)

// ── Venues ──
export const getVenues = (params) => api.get('/venues/', { params })
export const getVenue = (id) => api.get(`/venues/${id}/`)
export const getAvailability = (id, date) => api.get(`/venues/${id}/availability/`, { params: { date } })

// ── Bookings ──
export const getBookings = (params) => api.get('/bookings/', { params })
export const getBooking = (id) => api.get(`/bookings/${id}/`)
export const createBooking = (data) => api.post('/bookings/', data)
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel/`)

export default api
