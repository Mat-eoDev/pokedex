'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

const TYPE_KEYS = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'fairy',
] as const

export type TypeKey = (typeof TYPE_KEYS)[number]

interface TypeFilterContextValue {
  selectedTypes: string[]
  setSelectedTypes: (types: string[]) => void
  toggleType: (typeKey: string) => void
}

const TypeFilterContext = createContext<TypeFilterContextValue | null>(null)

export function TypeFilterProvider({ children }: { children: ReactNode }) {
  const [selectedTypes, setSelectedTypesState] = useState<string[]>([])

  const setSelectedTypes = useCallback((types: string[]) => {
    setSelectedTypesState(types)
  }, [])

  const toggleType = useCallback((typeKey: string) => {
    setSelectedTypesState((prev) =>
      prev.includes(typeKey) ? prev.filter((t) => t !== typeKey) : [...prev, typeKey]
    )
  }, [])

  return (
    <TypeFilterContext.Provider value={{ selectedTypes, setSelectedTypes, toggleType }}>
      {children}
    </TypeFilterContext.Provider>
  )
}

export function useTypeFilter(): TypeFilterContextValue {
  const ctx = useContext(TypeFilterContext)
  if (!ctx) throw new Error('useTypeFilter must be used within TypeFilterProvider')
  return ctx
}

export { TYPE_KEYS }
