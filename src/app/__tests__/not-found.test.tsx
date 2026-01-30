import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotFound from '../not-found'

describe('NotFound', () => {
  it('affiche le code 404', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('affiche le message page introuvable', () => {
    render(<NotFound />)
    expect(screen.getByText(/page introuvable/i)).toBeInTheDocument()
  })

  it('affiche un lien vers l’accueil', () => {
    render(<NotFound />)
    const link = screen.getByRole('link', { name: /retour.*accueil/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})
