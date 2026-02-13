import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LangContext'
import { updateMe } from '../services/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { t } = useLang()
  const { user, isAuthenticated, loading: authLoading, setUser } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login')
  }, [authLoading, isAuthenticated])

  useEffect(() => {
    if (user) setName(user.name || '')
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await updateMe({ name })
      setUser((prev) => ({ ...prev, ...data }))
      toast.success(t('profile_saved'))
    } catch {
      toast.error(t('error'))
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) return <div className="min-h-screen pt-24 text-center text-dark-500">{t('loading')}</div>
  if (!user) return null

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-lg mx-auto">
      <div className="glass-card p-8">
        <h1 className="text-2xl font-bold text-white mb-8">{t('profile_title')}</h1>

        <div className="mb-6">
          <label className="text-dark-400 text-sm mb-1.5 block">{t('auth_phone')}</label>
          <div className="bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-dark-400 text-sm">
            {user.phone_number}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-dark-400 text-sm mb-1.5 block">{t('profile_name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-50">
            {saving ? t('loading') : t('profile_save')}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-dark-700 text-sm text-dark-500 space-y-1">
          <div className="flex justify-between"><span>Status</span><span className={user.is_verified ? 'text-primary-400' : 'text-yellow-400'}>{user.is_verified ? '✓ Verified' : 'Unverified'}</span></div>
          <div className="flex justify-between"><span>Joined</span><span className="text-dark-300">{new Date(user.created_at).toLocaleDateString()}</span></div>
        </div>
      </div>
    </div>
  )
}
