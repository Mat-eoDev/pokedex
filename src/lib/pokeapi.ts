// Appels à l'API PokeAPI pour récupérer la liste, un pokemon ou sa species (noms en plusieurs langues)
const POKEAPI_BASE = 'https://pokeapi.co/api/v2'

export interface PokeApiListResult {
  name: string
  url: string
}

export interface PokeApiListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokeApiListResult[]
}

export interface PokeApiTypeSlot {
  slot: number
  type: { name: string; url: string }
}

export interface PokeApiMoveEntry {
  move: { name: string; url: string }
}

export interface PokeApiPokemon {
  id: number
  name: string
  height: number
  weight: number
  types: PokeApiTypeSlot[]
  moves: PokeApiMoveEntry[]
  sprites: {
    front_default: string | null
    other?: { 'official-artwork'?: { front_default?: string } }
  }
}

export interface PokeApiSpeciesName {
  language: { name: string }
  name: string
}

export interface PokeApiSpecies {
  id: number
  names: PokeApiSpeciesName[]
}

export async function fetchPokemonList(
  limit = 1025,
  offset = 0
): Promise<PokeApiListResponse> {
  const res = await fetch(
    `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) throw new Error('Failed to fetch pokemon list')
  return res.json()
}

export async function fetchPokemon(idOrName: string | number): Promise<PokeApiPokemon> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon/${idOrName}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Failed to fetch pokemon ${idOrName}`)
  return res.json()
}

export async function fetchPokemonSpecies(id: string | number): Promise<PokeApiSpecies> {
  const res = await fetch(`${POKEAPI_BASE}/pokemon-species/${id}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Failed to fetch species ${id}`)
  return res.json()
}

export function pokemonImageUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

// Récupère le nom du pokemon dans la langue demandée (species = données de l’espèce)
export function getNameForLanguage(
  species: PokeApiSpecies | undefined,
  language: string
): string {
  if (!species?.names?.length) return ''
  const lang = language.replace('_', '-')
  const entry = species.names.find((n) => n.language.name === lang)
  return entry?.name ?? species.names.find((n) => n.language.name === 'en')?.name ?? ''
}

export function getAllNamesFromSpecies(species: PokeApiSpecies | undefined): string[] {
  if (!species?.names?.length) return []
  return species.names.map((n) => n.name).filter(Boolean)
}
