import { Link } from 'react-router-dom'
import { useLang } from '../context/LangContext'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="bg-dark-900 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-sm">B</div>
              <span className="text-xl font-bold">Bron<span className="text-primary-400">24</span></span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed">{t('footer_desc')}</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer_company')}</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">{t('footer_about')}</a></li>
              <li><a href="#" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">{t('footer_partners')}</a></li>
              <li><Link to="/#faq" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">{t('footer_faq')}</Link></li>
              <li><Link to="/#contact" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">{t('footer_contact')}</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer_resources')}</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">{t('footer_blog')}</a></li>
              <li><a href="#" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">{t('footer_help')}</a></li>
              <li><a href="#" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">{t('footer_privacy')}</a></li>
              <li><a href="#" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">{t('footer_terms')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{t('footer_contact')}</h4>
            <ul className="space-y-3 text-dark-400 text-sm">
              <li>{t('contact_location_value')}</li>
              <li>+998 90 188 16 25</li>
              <li>info@bron24.uz</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">© 2026 Bron24. {t('footer_rights')}</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-dark-500 hover:text-primary-400 text-sm transition-colors">{t('footer_privacy')}</a>
            <a href="#" className="text-dark-500 hover:text-primary-400 text-sm transition-colors">{t('footer_terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
