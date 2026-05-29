import { createContext, useContext } from 'react'
import { t } from './i18n'

const TranslationContext = createContext(null)

export function TranslationProvider({ language, children }) {
  const translate = (key) => t(language, key)
  return (
    <TranslationContext.Provider value={{ t: translate, language }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    return { t: (key) => key, language: 'en-US' }
  }
  return context
}
