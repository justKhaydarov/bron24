import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getBooking, cancelBooking } from '../services/api'
import { useLang } from '../context/LangContext'
import toast from 'react-hot-toast'
import {
  HiOutlineCalendar, HiOutlineClock, HiOutlineLocationMarker,
  HiOutlineArrowLeft, HiOutlinePrinter
} from 'react-icons/hi'

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

export default function BookingDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    getBooking(id)
      .then(({ data }) => setBooking(data))
      .catch(() => navigate('/my-bookings'))
      .finally(() => setLoading(false))
  }, [id])

  const handleCancel = async () => {
    if (!window.confirm(t('my_bookings_cancel_confirm'))) return
    setCancelling(true)
    try {
      const { data } = await cancelBooking(id)
      setBooking(data)
      toast.success(t('booking_cancelled'))
    } catch (err) {
      toast.error(err.response?.data?.detail || t('error'))
    } finally {
      setCancelling(false)
    }
  }

  const handlePrint = () => window.print()

  if (loading) return <div className="min-h-screen pt-24 text-center text-dark-500">{t('loading')}</div>
  if (!booking) return null

  const formatPrice = (p) => Number(p).toLocaleString('uz-UZ')
  const venue = booking.venue_detail || {}
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed'
  const startH = parseInt(booking.start_time?.split(':')[0] || 0)
  const endH = parseInt(booking.end_time?.split(':')[0] || 0)
  const duration = endH - startH

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-3xl mx-auto">
      <Link to="/my-bookings" className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 text-sm mb-6 transition-colors print:hidden">
        <HiOutlineArrowLeft className="w-4 h-4" /> {t('back')}
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('booking_detail_title')} #{booking.id}</h1>
          <p className="text-dark-400 text-sm mt-1">
            {t('booking_detail_created')} {new Date(booking.created_at).toLocaleString()}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-xl text-sm font-semibold border self-start ${statusColors[booking.status]}`}>
          {t(`booking_${booking.status}`)}
        </span>
      </div>

      {/* Venue section */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xs uppercase tracking-wider text-dark-500 font-semibold mb-4">{t('booking_detail_venue')}</h2>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-dark-800 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            {venue.images?.[0]?.image ? (
              <img src={venue.images[0].image} alt={venue.name} className="w-full h-full object-cover" />
            ) : (
              <svg className="w-10 h-10 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
          </div>
          <div>
            <Link to={`/venues/${venue.id || booking.venue}`} className="text-xl font-bold text-white hover:text-primary-400 transition-colors">
              {venue.name || `Venue #${booking.venue}`}
            </Link>
            {venue.address && (
              <p className="text-dark-400 text-sm flex items-center gap-1 mt-1">
                <HiOutlineLocationMarker className="w-4 h-4" /> {venue.address}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Schedule & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-6">
          <h2 className="text-xs uppercase tracking-wider text-dark-500 font-semibold mb-4">{t('booking_detail_schedule')}</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                <HiOutlineCalendar className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <div className="text-dark-500 text-xs">{t('booking_date')}</div>
                <div className="text-white font-medium">{booking.booking_date}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                <HiOutlineClock className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <div className="text-dark-500 text-xs">{t('booking_detail_time')}</div>
                <div className="text-white font-medium">
                  {booking.start_time?.slice(0, 5)} — {booking.end_time?.slice(0, 5)}
                  <span className="text-dark-500 text-sm ml-2">({duration} {t('confirmation_hours')})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xs uppercase tracking-wider text-dark-500 font-semibold mb-4">{t('booking_detail_payment')}</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">{t('confirmation_hourly_rate')}</span>
              <span className="text-dark-300">{formatPrice(venue.price_per_hour || 0)} UZS</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">{t('confirmation_duration')}</span>
              <span className="text-dark-300">{duration} {t('confirmation_hours')}</span>
            </div>
            <div className="border-t border-dark-700 pt-3 flex justify-between">
              <span className="font-semibold text-white">{t('booking_total')}</span>
              <span className="font-bold text-primary-400 text-xl">{formatPrice(booking.total_price)} UZS</span>
            </div>
          </div>
          <div className="mt-4 bg-dark-800/50 rounded-lg p-3 text-xs text-dark-400 flex items-center gap-2">
            💳 {t('booking_detail_pay_onsite')}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        {canCancel && (
          <button onClick={handleCancel} disabled={cancelling}
            className="flex-1 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50">
            {cancelling ? t('loading') : t('booking_cancel')}
          </button>
        )}
        <button onClick={handlePrint}
          className="flex-1 btn-outline flex items-center justify-center gap-2">
          <HiOutlinePrinter className="w-5 h-5" />
          {t('booking_detail_print')}
        </button>
        <Link to="/venues" className="flex-1 btn-primary text-center">
          {t('booking_detail_book_another')}
        </Link>
      </div>
    </div>
  )
}
