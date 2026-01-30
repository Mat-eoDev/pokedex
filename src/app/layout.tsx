import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { Providers } from './Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pokedex',
  description: 'Pokédex avec PokeAPI',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <Suspense fallback={null}>
          <AppRouterCacheProvider>
            <Providers>{children}</Providers>
          </AppRouterCacheProvider>
        </Suspense>
      </body>
    </html>
  )
}
