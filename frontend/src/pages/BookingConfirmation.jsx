import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getBooking } from '../services/api'
import { useLang } from '../context/LangContext'
import { HiOutlineCheckCircle, HiOutlineCalendar, HiOutlineClock, HiOutlineLocationMarker } from 'react-icons/hi'

export default function BookingConfirmation() {
  const { id } = useParams()
  const { t } = useLang()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBooking(id)
      .then(({ data }) => setBooking(data))
      .catch(() => navigate('/my-bookings'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen pt-24 text-center text-dark-500">{t('loading')}</div>
  if (!booking) return null

  const formatPrice = (p) => Number(p).toLocaleString('uz-UZ')
  const venue = booking.venue_detail || {}

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-start justify-center">
      <div className="w-full max-w-lg">
        {/* Success animation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <HiOutlineCheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('confirmation_title')}</h1>
          <p className="text-dark-400">{t('confirmation_subtitle')}</p>
        </div>

        {/* Receipt card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-700">
            <div>
              <span className="text-dark-500 text-xs uppercase tracking-wider">{t('confirmation_booking_id')}</span>
              <div className="text-white font-bold text-lg">#{booking.id}</div>
            </div>
            <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold">
              {t(`booking_${booking.status}`)}
            </span>
          </div>

          {/* Venue info */}
          <div className="mb-5">
            <h3 className="text-white font-bold text-lg mb-1">{venue.name || `Venue #${booking.venue}`}</h3>
            {venue.address && (
              <p className="text-dark-400 text-sm flex items-center gap-1">
                <HiOutlineLocationMarker className="w-4 h-4 flex-shrink-0" />
                {venue.address}
              </p>
            )}
          </div>

          {/* Booking details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400 flex items-center gap-2">
                <HiOutlineCalendar className="w-4 h-4" /> {t('booking_date')}
              </span>
              <span className="text-white font-medium">{booking.booking_date}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400 flex items-center gap-2">
                <HiOutlineClock className="w-4 h-4" /> {t('booking_start')}
              </span>
              <span className="text-white font-medium">{booking.start_time?.slice(0, 5)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400 flex items-center gap-2">
                <HiOutlineClock className="w-4 h-4" /> {t('booking_end')}
              </span>
              <span className="text-white font-medium">{booking.end_time?.slice(0, 5)}</span>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-dark-800/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-dark-400">
              <span>{t('confirmation_hourly_rate')}</span>
              <span>{formatPrice(venue.price_per_hour || 0)} UZS</span>
            </div>
            <div className="flex justify-between text-sm text-dark-400">
              <span>{t('confirmation_duration')}</span>
              <span>{(() => {
                const startH = parseInt(booking.start_time?.split(':')[0] || 0)
                const endH = parseInt(booking.end_time?.split(':')[0] || 0)
                return `${endH - startH} ${t('confirmation_hours')}`
              })()}</span>
            </div>
            <div className="border-t border-dark-700 pt-2 mt-2 flex justify-between">
              <span className="font-semibold text-white">{t('booking_total')}</span>
              <span className="font-bold text-primary-400 text-lg">{formatPrice(booking.total_price)} UZS</span>
            </div>
          </div>
        </div>

        {/* Payment note */}
        <div className="glass-card p-4 mb-6 border-l-4 border-primary-500">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <p className="text-white font-medium text-sm">{t('confirmation_payment_title')}</p>
              <p className="text-dark-400 text-xs mt-1">{t('confirmation_payment_desc')}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={`/my-bookings/${booking.id}`} className="btn-primary flex-1 text-center">
            {t('confirmation_view_details')}
          </Link>
          <Link to="/my-bookings" className="btn-outline flex-1 text-center">
            {t('confirmation_all_bookings')}
          </Link>
        </div>
        <Link to="/venues" className="block text-center text-dark-400 hover:text-primary-400 text-sm mt-4 transition-colors">
          ← {t('confirmation_continue_browsing')}
        </Link>
      </div>
    </div>
  )
}
