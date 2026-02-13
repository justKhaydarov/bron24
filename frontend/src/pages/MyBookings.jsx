import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBookings, cancelBooking } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

export default function MyBookings() {
  const { t } = useLang()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    getBookings()
      .then(({ data }) => setBookings(data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleCancel = async (id) => {
    if (!window.confirm(t('my_bookings_cancel_confirm'))) return
    try {
      await cancelBooking(id)
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
      )
      toast.success(t('booking_cancelled'))
    } catch (err) {
      toast.error(err.response?.data?.detail || t('error'))
    }
  }

  const formatPrice = (p) => Number(p).toLocaleString('uz-UZ')
  const statusLabel = (s) => t(`booking_${s}`) || s

  if (authLoading || loading) {
    return <div className="min-h-screen pt-24 text-center text-dark-500">{t('loading')}</div>
  }

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">{t('my_bookings_title')}</h1>

      {bookings.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-dark-500 mb-6">{t('my_bookings_empty')}</p>
          <Link to="/venues" className="btn-primary">{t('venues_all')}</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Link key={b.id} to={`/my-bookings/${b.id}`} className="glass-card p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-primary-500/30 transition-colors cursor-pointer">
              {/* Venue info */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/venues/${b.venue_detail?.id || b.venue}`}
                  className="text-lg font-bold text-white hover:text-primary-400 transition-colors"
                >
                  {b.venue_detail?.name || `Venue #${b.venue}`}
                </Link>
                <div className="text-dark-400 text-sm mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span>📅 {b.booking_date}</span>
                  <span>🕐 {b.start_time?.slice(0, 5)} – {b.end_time?.slice(0, 5)}</span>
                  <span>💰 {formatPrice(b.total_price)} UZS</span>
                </div>
              </div>

              {/* Status + actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusColors[b.status] || 'bg-dark-800 text-dark-400'}`}>
                  {statusLabel(b.status)}
                </span>
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <button
                    onClick={(e) => { e.preventDefault(); handleCancel(b.id) }}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    {t('booking_cancel')}
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
