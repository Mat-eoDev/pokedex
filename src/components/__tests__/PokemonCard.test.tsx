import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PokemonCard } from '../PokemonCard'
import { LanguageProvider } from '@/context/LanguageContext'
import type { PokeApiPokemon } from '@/lib/pokeapi'

const mockPokemon: PokeApiPokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [
    { slot: 1, type: { name: 'electric', url: '' } },
  ],
  moves: [{ move: { name: 'thunderbolt', url: '' } }],
  sprites: { front_default: 'https://example.com/pikachu.png' },
}

function renderCard(pokemon: PokeApiPokemon = mockPokemon) {
  return render(
    <LanguageProvider>
      <PokemonCard pokemon={pokemon} />
    </LanguageProvider>
  )
}

describe('PokemonCard', () => {
  it('affiche le numéro du Pokémon', () => {
    renderCard()
    expect(screen.getByText('#025')).toBeInTheDocument()
  })

  it('affiche le nom du Pokémon', () => {
    renderCard()
    expect(screen.getByText('pikachu')).toBeInTheDocument()
  })

  it('a un lien vers la page détail', () => {
    renderCard()
    const link = screen.getByRole('link', { name: /pikachu/i })
    expect(link).toHaveAttribute('href', '/pokemon/25')
  })

  it('affiche les types', () => {
    renderCard()
    expect(screen.getByText(/electric|électrik/i)).toBeInTheDocument()
  })
})
