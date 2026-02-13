import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiMenu, HiX } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'

const langs = [
  { code: 'uz', label: 'UZ' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const { lang, switchLang, t } = useLang()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { to: '/', label: t('nav_home') },
    { to: '/venues', label: t('nav_venues') },
    ...(isAuthenticated
      ? [
          { to: '/my-bookings', label: t('nav_my_bookings') },
          { to: '/profile', label: t('nav_profile') },
        ]
      : []),
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-sm">B</div>
            <span className="text-xl font-bold">Bron<span className="text-primary-400">24</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center bg-dark-800 rounded-lg p-0.5">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => switchLang(l.code)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    lang === l.code
                      ? 'bg-primary-500 text-white'
                      : 'text-dark-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {isAuthenticated ? (
              <button onClick={logout} className="text-sm text-dark-400 hover:text-white transition-colors">
                {t('nav_logout')}
              </button>
            ) : (
              <Link to="/login" className="btn-primary !py-2 !px-5 text-sm">
                {t('nav_login')}
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
            {open ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-dark-800 mt-2 pt-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.to) ? 'text-primary-400 bg-primary-500/10' : 'text-dark-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-4 pt-2">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { switchLang(l.code); setOpen(false) }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    lang === l.code ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-400'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="px-4 pt-2">
              {isAuthenticated ? (
                <button onClick={() => { logout(); setOpen(false) }} className="text-sm text-dark-400">
                  {t('nav_logout')}
                </button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-primary block text-center text-sm !py-2">
                  {t('nav_login')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
