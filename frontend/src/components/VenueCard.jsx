import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function VenueCard({ venue }) {
  const { t } = useLang()

  const amenities = Array.isArray(venue.amenities) ? venue.amenities.slice(0, 3) : []
  const image = venue.images?.[0]?.image || null

  const formatPrice = (price) => {
    return Number(price).toLocaleString('uz-UZ')
  }

  return (
    <div className="glass-card overflow-hidden group hover:border-primary-500/30 transition-all duration-500">
      {/* Image */}
      <div className="relative h-48 bg-dark-800 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={venue.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/30 to-dark-800">
            <svg className="w-16 h-16 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-dark-900/80 backdrop-blur-sm text-primary-400 font-bold text-sm px-3 py-1.5 rounded-lg">
          {formatPrice(venue.price_per_hour)} UZS
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
          {venue.name}
        </h3>
        <p className="text-dark-400 text-sm mb-3 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {venue.address}
        </p>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {amenities.map((a, i) => (
              <span key={i} className="bg-dark-700/50 text-dark-300 text-xs px-2.5 py-1 rounded-md">
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Bottom */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-700/50">
          <div>
            <span className="text-primary-400 font-bold text-lg">{formatPrice(venue.price_per_hour)}</span>
            <span className="text-dark-500 text-sm ml-1">UZS / {t('venues_per_hour')}</span>
          </div>
          <Link
            to={`/venues/${venue.id}`}
            className="bg-primary-500/10 text-primary-400 hover:bg-primary-500 hover:text-white font-medium text-sm px-4 py-2 rounded-lg transition-all duration-300"
          >
            {t('venues_book_now')}
          </Link>
        </div>
      </div>
    </div>
  )
}
