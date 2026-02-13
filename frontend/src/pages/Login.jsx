import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendOtp, verifyOtp } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { t } = useLang()
  const { login } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1 = phone, 2 = otp
  const [phone, setPhone] = useState('+998')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await sendOtp(phone)
      toast.success(t('auth_otp_sent'))
      setStep(2)
    } catch (err) {
      toast.error(err.response?.data?.detail || err.response?.data?.phone_number?.[0] || t('error'))
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await verifyOtp(phone, otp)
      login(data.access, data.refresh)
      toast.success('Welcome!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="glass-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-sm">B</div>
          </div>
          <h1 className="text-2xl font-bold text-white">{t('auth_title')}</h1>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="text-dark-400 text-sm mb-1.5 block">{t('auth_phone')}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('auth_phone_placeholder')}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? t('loading') : t('auth_send_otp')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="text-dark-400 text-sm mb-1.5 block">{t('auth_phone')}</label>
              <div className="text-white font-medium bg-dark-800 rounded-xl px-4 py-3 border border-dark-700">
                {phone}
              </div>
            </div>
            <div>
              <label className="text-dark-400 text-sm mb-1.5 block">{t('auth_otp')}</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={t('auth_otp_placeholder')}
                maxLength={6}
                className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-[0.5em] placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                required
                autoFocus
              />
              <p className="text-dark-500 text-xs mt-2">
                💡 Check the server console/logs for the OTP code
              </p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? t('loading') : t('auth_verify')}
            </button>
            <button
              type="button"
              onClick={() => { setStep(1); setOtp('') }}
              className="w-full text-dark-400 text-sm hover:text-white transition-colors"
            >
              ← {t('back')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
