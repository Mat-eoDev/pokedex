'use client'

// Theme MUI + tous les providers (langue, recherche, filtre type, TanStack Query)
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AppBar, Toolbar, InputBase, alpha } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Logo } from '@/components/Logo'
import { LanguageSelection } from '@/components/LanguageSelection'
import { LanguageProvider } from '@/context/LanguageContext'
import { TypeFilterProvider } from '@/context/TypeFilterContext'
import { TypeFilter } from '@/components/TypeFilter'
import type { ReactNode } from 'react'
import type { LanguageCode } from '@/context/LanguageContext'

const SEARCH_STORAGE_KEY = 'pokedex-search'

const SearchQueryContext = createContext('')
export function useSearchQuery() {
  return useContext(SearchQueryContext)
}

const SetSearchQueryContext = createContext<((q: string) => void) | null>(null)
export function useSetSearchQuery() {
  return useContext(SetSearchQueryContext)
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
})

function AppBarWithSearch({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string
  setSearchQuery: (q: string) => void
}) {
  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 }, gap: 2 }}>
        <Logo />
        <InputBase
          placeholder="Rechercher un Pokémon…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startAdornment={<SearchIcon sx={{ color: 'inherit', mr: 1, fontSize: 22 }} />}
          sx={{
            flex: { xs: 1, sm: '0 1 280px' },
            maxWidth: 320,
            color: 'inherit',
            bgcolor: (t) => alpha(t.palette.common.white, 0.15),
            borderRadius: 2,
            px: 1.5,
            py: 0.75,
            '&:hover': { bgcolor: (t) => alpha(t.palette.common.white, 0.25) },
            '& .MuiInputBase-input': { py: 0.5 },
          }}
          inputProps={{ 'aria-label': 'Rechercher un Pokémon' }}
        />
        <TypeFilter />
        <LanguageSelection />
      </Toolbar>
    </AppBar>
  )
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient()
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

function readStoredSearch(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(SEARCH_STORAGE_KEY) ?? ''
}

export function Providers({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = getQueryClient()

  const urlLang = searchParams?.get('lang') as LanguageCode | null
  const validLang =
    urlLang && ['en', 'fr', 'de', 'es', 'ja'].includes(urlLang) ? urlLang : null

  const [searchQuery, setSearchQueryState] = useState('')

  useEffect(() => {
    const q = searchParams?.get('q') ?? readStoredSearch()
    setSearchQueryState(q)
  }, [searchParams])

  const setSearchQuery = useCallback(
    (q: string) => {
      setSearchQueryState(q)
      if (typeof window !== 'undefined') localStorage.setItem(SEARCH_STORAGE_KEY, q)
      if (pathname === '/') {
        const params = new URLSearchParams(searchParams?.toString() ?? '')
        if (q) params.set('q', q)
        else params.delete('q')
        const query = params.toString()
        router.replace(query ? `/?${query}` : '/', { scroll: false })
      }
    },
    [pathname, searchParams, router]
  )

  const syncLangToUrl = useCallback(
    (lang: LanguageCode) => {
      if (pathname === '/') {
        const params = new URLSearchParams(searchParams?.toString() ?? '')
        params.set('lang', lang)
        router.replace(`/?${params.toString()}`, { scroll: false })
      }
    },
    [pathname, searchParams, router]
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LanguageProvider initialLanguage={validLang} onLanguageChange={syncLangToUrl}>
          <TypeFilterProvider>
            <SetSearchQueryContext.Provider value={setSearchQuery}>
              <AppBarWithSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <SearchQueryContext.Provider value={searchQuery}>
                {children}
              </SearchQueryContext.Provider>
            </SetSearchQueryContext.Provider>
          </TypeFilterProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

