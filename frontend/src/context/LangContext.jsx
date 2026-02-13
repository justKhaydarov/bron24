import { createContext, useContext, useState } from 'react'
import translations from '../i18n/translations'

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'uz')

  const switchLang = (newLang) => {
    setLang(newLang)
    localStorage.setItem('lang', newLang)
  }

  const t = (key) => translations[lang]?.[key] || translations['en']?.[key] || key

  return (
    <LangContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
