import { useEffect, useState } from 'react'
import { getVenues } from '../services/api'
import { useLang } from '../context/LangContext'
import VenueCard from '../components/VenueCard'
import { HiOutlineSearch } from 'react-icons/hi'

export default function Venues() {
  const { t } = useLang()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchVenues = () => {
    setLoading(true)
    const params = { page }
    if (search) params.search = search
    if (minPrice) params.min_price = minPrice
    if (maxPrice) params.max_price = maxPrice

    getVenues(params)
      .then(({ data }) => {
        setVenues(data.results || [])
        setTotalPages(Math.ceil((data.count || 0) / 10))
      })
      .catch(() => setVenues([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchVenues() }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchVenues()
  }

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('venues_title')}</h1>
        <p className="text-dark-400 text-lg max-w-xl mx-auto">{t('venues_subtitle')}</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="glass-card p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('venues_search')}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors text-sm"
            />
          </div>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min UZS"
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 w-full md:w-36 text-sm"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max UZS"
            className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 w-full md:w-36 text-sm"
          />
          <button type="submit" className="btn-primary !py-3 whitespace-nowrap">
            <HiOutlineSearch className="w-5 h-5 inline mr-1" />
            {t('venues_search').replace('...', '')}
          </button>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center text-dark-500 py-20">{t('loading')}</div>
      ) : venues.length === 0 ? (
        <div className="text-center text-dark-500 py-20">{t('venues_no_results')}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                    page === p
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
