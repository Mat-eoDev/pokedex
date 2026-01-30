'use client'

// Liste des 151 premiers pokemon : on charge species + pokemon pour avoir noms traduits et types, puis on filtre (recherche + type)
import { useMemo } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { Box, Typography, CircularProgress } from '@mui/material'
import { PokemonCard } from './PokemonCard'
import { useSearchQuery } from '@/app/Providers'
import { useLanguage } from '@/context/LanguageContext'
import { useTypeFilter } from '@/context/TypeFilterContext'
import type { PokeApiPokemon } from '@/lib/pokeapi'
import {
  fetchPokemonList,
  fetchPokemon,
  fetchPokemonSpecies,
  getNameForLanguage,
  getAllNamesFromSpecies,
} from '@/lib/pokeapi'

const LIST_LIMIT = 151
const VISIBLE_COUNT = 48

export function PokemonList() {
  const searchQuery = useSearchQuery()
  const { language } = useLanguage()
  const { selectedTypes } = useTypeFilter()

  const listQuery = useQuery({
    queryKey: ['pokemonList', LIST_LIMIT],
    queryFn: () => fetchPokemonList(LIST_LIMIT, 0),
  })

  const results = listQuery.data?.results ?? []
  const { allIds, idToEnglishName } = useMemo(() => {
    const ids: number[] = []
    const englishNames: Record<number, string> = {}
    results.forEach((r) => {
      const match = r.url.match(/\/pokemon\/(\d+)\//)
      if (match) {
        const id = parseInt(match[1], 10)
        ids.push(id)
        englishNames[id] = r.name
      }
    })
    return { allIds: ids, idToEnglishName: englishNames }
  }, [results])

  const allSpeciesQueries = useQueries({
    queries: allIds.map((id) => ({
      queryKey: ['pokemon-species', id],
      queryFn: () => fetchPokemonSpecies(id),
    })),
    combine: (results) => ({
      data: results.map((r) => r.data),
      isPending: results.some((r) => r.isPending),
    }),
  })

  const idToSpecies = useMemo(() => {
    const map: Record<number, Awaited<ReturnType<typeof fetchPokemonSpecies>> | undefined> = {}
    allIds.forEach((id, index) => {
      map[id] = allSpeciesQueries.data?.[index]
    })
    return map
  }, [allIds, allSpeciesQueries.data])

  const allPokemonQueries = useQueries({
    queries: allIds.map((id) => ({
      queryKey: ['pokemon', id],
      queryFn: () => fetchPokemon(id),
    })),
    combine: (results) => ({
      data: results.map((r) => r.data),
      isPending: results.some((r) => r.isPending),
    }),
  })

  const idToPokemon = useMemo(() => {
    const map: Record<number, Awaited<ReturnType<typeof fetchPokemon>> | undefined> = {}
    allIds.forEach((id, index) => {
      map[id] = allPokemonQueries.data?.[index]
    })
    return map
  }, [allIds, allPokemonQueries.data])

  const filteredIds = useMemo(() => {
    let ids = allIds

    if (selectedTypes.length > 0) {
      ids = ids.filter((id) => {
        const pokemon = idToPokemon[id]
        if (!pokemon?.types?.length) return false
        return pokemon.types.some((t) => selectedTypes.includes(t.type.name))
      })
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      ids = ids.filter((id) => {
        if (String(id) === q) return true
        const species = idToSpecies[id]
        const names = getAllNamesFromSpecies(species)
        if (names.length > 0) {
          return names.some((name) => name.toLowerCase().includes(q))
        }
        const englishName = idToEnglishName[id]
        return englishName?.toLowerCase().includes(q) ?? false
      })
    }

    return ids
  }, [allIds, searchQuery, selectedTypes, idToSpecies, idToEnglishName, idToPokemon])

  const visibleIds = filteredIds.slice(0, VISIBLE_COUNT)

  const pokemonList = useMemo(
    () =>
      visibleIds
        .map((id) => idToPokemon[id])
        .filter((p): p is PokeApiPokemon => p != null),
    [visibleIds, idToPokemon]
  )
  const isLoadingDetails = allPokemonQueries.isPending

  if (listQuery.isPending || listQuery.isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        {listQuery.isPending && <CircularProgress />}
        {listQuery.isError && (
          <Typography color="error">Impossible de charger la liste des Pokémon.</Typography>
        )}
      </Box>
    )
  }


  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        py: 4,
        px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 6 },
        display: 'flex',
        flexWrap: 'wrap',
        gap: { xs: 2, sm: 3, md: 4 },
        justifyContent: 'center',
      }}
    >
      {filteredIds.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          Aucun Pokémon trouvé pour « {searchQuery} »
        </Typography>
      ) : isLoadingDetails && pokemonList.length === 0 ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : (
        pokemonList.map((pokemon) => {
          if (!pokemon) return null
          const species = idToSpecies[pokemon.id]
          const displayName =
            getNameForLanguage(species, language) || pokemon.name
          return (
            <Box key={pokemon.id} sx={{ width: 280, height: 380 }}>
              <PokemonCard pokemon={pokemon} displayName={displayName} />
            </Box>
          )
        })
      )}
    </Box>
  )
}
