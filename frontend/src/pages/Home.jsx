import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineSearch, HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineStar, HiOutlineClock, HiOutlineCash } from 'react-icons/hi'
import { getVenues } from '../services/api'
import { useLang } from '../context/LangContext'
import VenueCard from '../components/VenueCard'

/* ─── Hero ─── */
function Hero() {
  const { t } = useLang()
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 text-center pt-20">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
          BRON24
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
          {t('hero_title_1')}<br />
          <span className="gradient-text">{t('hero_title_2')}</span>
        </h1>
        <p className="text-dark-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('hero_subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/venues" className="btn-primary text-lg px-10 py-4">
            {t('hero_cta')}
          </Link>
          <a href="#how-it-works" className="btn-outline text-lg px-10 py-4">
            {t('hero_how')}
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 md:gap-16 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">12+</div>
            <div className="text-dark-500 text-sm mt-1">Venues</div>
          </div>
          <div className="w-px h-10 bg-dark-700" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-dark-500 text-sm mt-1">Support</div>
          </div>
          <div className="w-px h-10 bg-dark-700" />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">3</div>
            <div className="text-dark-500 text-sm mt-1">Languages</div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Why Us ─── */
function WhyUs() {
  const { t } = useLang()
  const features = [
    { icon: HiOutlineSearch, title: t('why_easy_title'), desc: t('why_easy_desc') },
    { icon: HiOutlineClock, title: t('why_live_title'), desc: t('why_live_desc') },
    { icon: HiOutlineLocationMarker, title: t('why_locations_title'), desc: t('why_locations_desc') },
    { icon: HiOutlineCash, title: t('why_secure_title'), desc: t('why_secure_desc') },
    { icon: HiOutlineUserGroup, title: t('why_community_title'), desc: t('why_community_desc') },
    { icon: HiOutlineStar, title: t('why_quality_title'), desc: t('why_quality_desc') },
  ]

  return (
    <section className="section-padding" id="why-us">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('why_title')} <span className="gradient-text">{t('why_brand')}</span>
          </h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">{t('why_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-7 hover:border-primary-500/30 transition-all duration-500 group">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-500/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-dark-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How It Works ─── */
function HowItWorks() {
  const { t } = useLang()
  const steps = [
    { num: '01', title: t('how_step1_title'), desc: t('how_step1_desc'), icon: HiOutlineSearch },
    { num: '02', title: t('how_step2_title'), desc: t('how_step2_desc'), icon: HiOutlineCalendar },
    { num: '03', title: t('how_step3_title'), desc: t('how_step3_desc'), icon: HiOutlineShieldCheck },
  ]

  return (
    <section className="section-padding bg-dark-900/50" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('how_title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative text-center group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-dark-700" />
              )}
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-500/5 border border-primary-500/20 flex items-center justify-center group-hover:from-primary-500/30 transition-all duration-500">
                <s.icon className="w-10 h-10 text-primary-400" />
              </div>
              <div className="text-primary-500 font-bold text-sm mb-2">{s.num}</div>
              <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
              <p className="text-dark-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Venues Preview ─── */
function VenuesPreview() {
  const { t } = useLang()
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVenues({ page: 1 })
      .then(({ data }) => setVenues(data.results?.slice(0, 6) || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="section-padding" id="venues">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('venues_title')}</h2>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">{t('venues_subtitle')}</p>
        </div>

        {loading ? (
          <div className="text-center text-dark-500 py-20">{t('loading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/venues" className="btn-outline">
            {t('venues_all')} →
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Reviews ─── */
function Reviews() {
  const { t } = useLang()
  const reviews = [
    { name: 'Muhiddin X.', role: 'Bloger', text: "Bron24 jamoamizning jadvalini soddalashtirdi! Interfeys intuitiv va joylarni topish juda oson." },
    { name: 'Azamat M.', role: "O'yinchi", text: "Bron qilish juda oson! Avvallari telefon qilishim kerak edi, endi bir necha bosishda." },
    { name: 'Ulugbek O.', role: 'Jamoa sardori', text: "Ajoyib xizmat! Narxlar aniq ko'rsatilgan, tavsiya qilaman!" },
    { name: 'Sardor M.', role: "Foydalanuvchi", text: "Ilova tez ishlaydi va interfeysi aniq. Oldin bron qilingan vaqtlarni ham ko'rsatishini yoqtirdim." },
  ]

  return (
    <section className="section-padding bg-dark-900/50" id="reviews">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('reviews_title')}</h2>
          <p className="text-dark-400 text-lg">{t('reviews_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="glass-card p-7">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <HiOutlineStar key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-dark-300 text-sm leading-relaxed mb-5 italic">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold text-sm">
                  {r.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{r.name}</div>
                  <div className="text-dark-500 text-xs">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ─── */
function FAQ() {
  const { t } = useLang()
  const [openIdx, setOpenIdx] = useState(null)

  const faqs = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
    { q: t('faq_q5'), a: t('faq_a5') },
    { q: t('faq_q6'), a: t('faq_a6') },
  ]

  return (
    <section className="section-padding" id="faq">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('faq_title')}</h2>
          <p className="text-dark-400 text-lg">{t('faq_subtitle')}</p>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="glass-card overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-semibold pr-4">
                  <span className="text-primary-500 mr-3">{String(i + 1).padStart(2, '0')}</span>
                  {f.q}
                </span>
                <span className={`text-dark-400 transition-transform duration-300 flex-shrink-0 ${openIdx === i ? 'rotate-45' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>
              <div className={`transition-all duration-300 ${openIdx === i ? 'max-h-40 pb-5 px-5' : 'max-h-0'} overflow-hidden`}>
                <p className="text-dark-400 text-sm leading-relaxed pl-9">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Contact ─── */
function Contact() {
  const { t } = useLang()

  return (
    <section className="section-padding bg-dark-900/50" id="contact">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('contact_title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[
              { label: t('contact_location'), value: t('contact_location_value'), icon: HiOutlineLocationMarker },
              { label: t('contact_phone'), value: '+998 90 188 16 25', icon: HiOutlineClock },
              { label: t('contact_email'), value: 'info@bron24.uz', icon: HiOutlineStar },
              { label: t('contact_hours'), value: t('contact_hours_value'), icon: HiOutlineCalendar },
            ].map((c, i) => (
              <div key={i} className="glass-card p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <c.icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <div className="text-dark-500 text-xs uppercase tracking-wider">{c.label}</div>
                  <div className="text-white font-medium text-sm mt-0.5">{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-sm">B</div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Bron24</h3>
            <p className="text-dark-400 text-sm mb-6">{t('hero_subtitle')}</p>
            <Link to="/venues" className="btn-primary">
              {t('hero_cta')} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Home Page ─── */
export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <HowItWorks />
      <VenuesPreview />
      <Reviews />
      <FAQ />
      <Contact />
    </>
  )
}
