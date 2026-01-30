'use client'

// Contexte pour la langue affichée (noms des pokemon, libellés, etc.)
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

export type LanguageCode = 'en' | 'fr' | 'de' | 'es' | 'ja'

const STORAGE_KEY = 'pokedex-lang'

const VALID_LANGS: LanguageCode[] = ['en', 'fr', 'de', 'es', 'ja']

interface LanguageContextValue {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  children,
  initialLanguage,
  onLanguageChange,
}: {
  children: ReactNode
  initialLanguage?: LanguageCode | null
  onLanguageChange?: (lang: LanguageCode) => void
}) {
  const [language, setLanguageState] = useState<LanguageCode>('en')

  useEffect(() => {
    const fromUrl = initialLanguage && VALID_LANGS.includes(initialLanguage) ? initialLanguage : null
    const fromStorage =
      typeof window !== 'undefined'
        ? (localStorage.getItem(STORAGE_KEY) as LanguageCode | null)
        : null
    const next = fromUrl ?? (fromStorage && VALID_LANGS.includes(fromStorage) ? fromStorage : null) ?? 'en'
    setLanguageState(next)
  }, [initialLanguage])

  const setLanguage = useCallback(
    (lang: LanguageCode) => {
      setLanguageState(lang)
      if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, lang)
      onLanguageChange?.(lang)
    },
    [onLanguageChange]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
