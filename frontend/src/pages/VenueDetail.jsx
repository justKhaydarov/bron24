import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getVenue, getAvailability, createBooking } from '../services/api'
import { useLang } from '../context/LangContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { HiOutlineArrowLeft, HiOutlineClock, HiOutlineCalendar } from 'react-icons/hi'

export default function VenueDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLang()
  const { isAuthenticated } = useAuth()

  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedStart, setSelectedStart] = useState(null)
  const [selectedEnd, setSelectedEnd] = useState(null)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    getVenue(id)
      .then(({ data }) => setVenue(data))
      .catch(() => navigate('/venues'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!date) return
    setSlotsLoading(true)
    setSelectedStart(null)
    setSelectedEnd(null)
    getAvailability(id, date)
      .then(({ data }) => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false))
  }, [date, id])

  const handleSlotClick = (slot) => {
    if (!slot.is_available) return
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(slot.start_time)
      setSelectedEnd(slot.end_time)
    } else {
      // Determine new range boundaries
      let newStart = selectedStart
      let newEnd = slot.end_time
      if (slot.start_time < selectedStart) {
        newStart = slot.start_time
        newEnd = selectedEnd || slot.end_time
      }
      // Check all intermediate slots are available
      const rangeValid = slots.every((s) => {
        if (s.start_time >= newStart && s.end_time <= newEnd) {
          return s.is_available
        }
        return true
      })
      if (rangeValid) {
        setSelectedStart(newStart)
        setSelectedEnd(newEnd)
      } else {
        // Reset to just the clicked slot
        setSelectedStart(slot.start_time)
        setSelectedEnd(slot.end_time)
      }
    }
  }

  const isSelected = (slot) => {
    if (!selectedStart || !selectedEnd) return false
    return slot.start_time >= selectedStart && slot.end_time <= selectedEnd
  }

  const calcTotal = () => {
    if (!selectedStart || !selectedEnd || !venue) return 0
    const startH = parseInt(selectedStart.split(':')[0])
    const endH = parseInt(selectedEnd.split(':')[0])
    return (endH - startH) * Number(venue.price_per_hour)
  }

  const handleBook = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    if (!date || !selectedStart || !selectedEnd) return

    setBooking(true)
    try {
      const { data } = await createBooking({
        venue: Number(id),
        booking_date: date,
        start_time: selectedStart + ':00',
        end_time: selectedEnd + ':00',
      })
      toast.success(t('booking_success'))
      navigate(`/booking-confirmation/${data.id}`)
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.detail
        || JSON.stringify(err.response?.data)
        || t('error')
      toast.error(msg)
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <div className="pt-24 text-center text-dark-500 min-h-screen">{t('loading')}</div>
  if (!venue) return null

  const formatPrice = (p) => Number(p).toLocaleString('uz-UZ')
  const amenities = Array.isArray(venue.amenities) ? venue.amenities : []
  const image = venue.images?.[0]?.image || null

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto min-h-screen">
      {/* Back */}
      <Link to="/venues" className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 text-sm mb-6 transition-colors">
        <HiOutlineArrowLeft className="w-4 h-4" /> {t('back')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Venue info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden h-64 md:h-80 bg-dark-800">
            {image ? (
              <img src={image} alt={venue.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/30 to-dark-800">
                <svg className="w-24 h-24 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="glass-card p-6">
            <h1 className="text-3xl font-bold text-white mb-2">{venue.name}</h1>
            <p className="text-dark-400 text-sm flex items-center gap-1 mb-4">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {venue.address}
            </p>
            <p className="text-dark-300 text-sm leading-relaxed mb-6">{venue.description}</p>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-primary-400 font-bold text-2xl">{formatPrice(venue.price_per_hour)}</span>
              <span className="text-dark-500">UZS / {t('venues_per_hour')}</span>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">{t('detail_amenities')}</h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a, i) => (
                    <span key={i} className="bg-dark-700/50 text-dark-300 text-sm px-3 py-1.5 rounded-lg">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Booking panel */}
        <div className="space-y-6">
          <div className="glass-card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <HiOutlineCalendar className="w-5 h-5 text-primary-400" />
              {t('detail_availability')}
            </h2>

            {/* Date picker */}
            <div className="mb-5">
              <label className="text-dark-400 text-sm mb-1.5 block">{t('detail_select_date')}</label>
              <input
                type="date"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors text-sm"
              />
            </div>

            {/* Time slots */}
            {date && (
              <>
                {slotsLoading ? (
                  <div className="text-center text-dark-500 py-6 text-sm">{t('loading')}</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {slots.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSlotClick(s)}
                        disabled={!s.is_available}
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isSelected(s)
                            ? 'bg-primary-500 text-white'
                            : s.is_available
                              ? 'bg-dark-800 text-dark-300 hover:bg-dark-700 border border-dark-700'
                              : 'bg-dark-800/50 text-dark-600 cursor-not-allowed border border-dark-800'
                        }`}
                      >
                        <HiOutlineClock className="w-3.5 h-3.5" />
                        {s.start_time}–{s.end_time}
                      </button>
                    ))}
                  </div>
                )}

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs text-dark-500 mb-5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-dark-800 border border-dark-700 rounded" />
                    {t('detail_available')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-dark-800/50 rounded" />
                    {t('detail_booked')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-primary-500 rounded" />
                    Selected
                  </span>
                </div>

                {/* Summary & book */}
                {selectedStart && selectedEnd && (
                  <div className="bg-dark-800/50 rounded-xl p-4 mb-4 space-y-2 text-sm">
                    <div className="flex justify-between text-dark-400">
                      <span>{t('booking_date')}</span>
                      <span className="text-white">{date}</span>
                    </div>
                    <div className="flex justify-between text-dark-400">
                      <span>{t('booking_start')}</span>
                      <span className="text-white">{selectedStart}</span>
                    </div>
                    <div className="flex justify-between text-dark-400">
                      <span>{t('booking_end')}</span>
                      <span className="text-white">{selectedEnd}</span>
                    </div>
                    <div className="flex justify-between text-dark-400 pt-2 border-t border-dark-700">
                      <span className="font-semibold">{t('booking_total')}</span>
                      <span className="text-primary-400 font-bold">{formatPrice(calcTotal())} UZS</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBook}
                  disabled={!selectedStart || !selectedEnd || booking}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {booking ? t('loading') : isAuthenticated ? t('detail_book') : t('nav_login')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
