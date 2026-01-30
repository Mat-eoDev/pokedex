'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SportsMmaIcon from '@mui/icons-material/SportsMma'
import CloseIcon from '@mui/icons-material/Close'
import typesData from '@/data/types.json'
import { useLanguage } from '@/context/LanguageContext'
import {
  fetchPokemon,
  fetchPokemonSpecies,
  getNameForLanguage,
  pokemonImageUrl,
} from '@/lib/pokeapi'

const TYPES_DATA: Record<
  string,
  { backgroundColor: string; translations: Record<string, string> }
> = typesData as never

// PokeAPI donne la taille et le poids
function formatHeight(dm: number | undefined): string {
  if (dm == null) return '—'
  const m = dm / 10
  return m >= 1 ? `${m} m` : `${dm * 10} cm`
}

function formatWeight(hg: number | undefined): string {
  if (hg == null) return '—'
  return `${hg / 10} kg`
}

function getTypeName(typeKey: string, language: string): string {
  const type = TYPES_DATA[typeKey]
  return type?.translations?.[language] ?? type?.translations?.en ?? typeKey
}

function getTypeColor(typeKey: string): string {
  const type = TYPES_DATA[typeKey]
  return type?.backgroundColor ?? '#A8A77A'
}

const MOVES_LABELS: Record<string, { button: string; dialogTitle: (name: string) => string; close: string }> = {
  en: { button: 'View moves', dialogTitle: (name) => `Moves of ${name}`, close: 'Close' },
  fr: { button: 'Voir les attaques', dialogTitle: (name) => `Attaques de ${name}`, close: 'Fermer' },
  de: { button: 'Attacken anzeigen', dialogTitle: (name) => `Attacken von ${name}`, close: 'Schließen' },
  es: { button: 'Ver ataques', dialogTitle: (name) => `Ataques de ${name}`, close: 'Cerrar' },
  ja: { button: 'わざを見る', dialogTitle: (name) => `${name}のわざ`, close: '閉じる' },
}

export function PokemonDetailClient({ id }: { id: string }) {
  const { language } = useLanguage()
  const [movesOpen, setMovesOpen] = useState(false)

  const pokemonQuery = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => fetchPokemon(id),
  })

  const speciesQuery = useQuery({
    queryKey: ['pokemon-species', id],
    queryFn: () => fetchPokemonSpecies(id),
    enabled: !!pokemonQuery.data,
  })

  const pokemon = pokemonQuery.data
  const species = speciesQuery.data
  const displayName = getNameForLanguage(species, language) || pokemon?.name || ''

  if (pokemonQuery.isPending || !pokemon) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        {pokemonQuery.isPending && <CircularProgress />}
        {pokemonQuery.isError && (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography color="text.secondary">Pokémon introuvable.</Typography>
            <Button component={Link} href="/" sx={{ mt: 2 }}>
              Retour à la liste
            </Button>
          </Box>
        )}
      </Box>
    )
  }

  const moves = pokemon.moves?.map((m) => m.move.name) ?? []
  const imageUrl = pokemon.sprites?.front_default ?? pokemonImageUrl(pokemon.id)

  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', py: 4, px: 2 }}>
      <Button component={Link} href="/" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
        Retour
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box
          component="img"
          src={imageUrl}
          alt={displayName}
          sx={{
            width: 200,
            height: 200,
            objectFit: 'contain',
            backgroundColor: 'grey.50',
            borderRadius: 3,
            p: 2,
          }}
        />
        <Typography variant="h4" component="h1" fontWeight={600}>
          {displayName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          #{String(pokemon.id).padStart(3, '0')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {pokemon.types?.map((t) => (
            <Chip
              key={t.type.name}
              label={getTypeName(t.type.name, language)}
              sx={{
                backgroundColor: getTypeColor(t.type.name),
                color: 'white',
                fontWeight: 600,
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Taille
            </Typography>
            <Typography variant="h6">{formatHeight(pokemon.height)}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Poids
            </Typography>
            <Typography variant="h6">{formatWeight(pokemon.weight)}</Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<SportsMmaIcon />}
          onClick={() => setMovesOpen(true)}
          sx={{ mt: 2 }}
        >
          {MOVES_LABELS[language]?.button ?? MOVES_LABELS.en.button}
        </Button>
      </Box>

      <Dialog
        open={movesOpen}
        onClose={() => setMovesOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {(MOVES_LABELS[language] ?? MOVES_LABELS.en).dialogTitle(displayName)}
          <IconButton
            aria-label={MOVES_LABELS[language]?.close ?? MOVES_LABELS.en.close}
            onClick={() => setMovesOpen(false)}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
            {moves.map((move, index) => (
              <ListItem key={`${move}-${index}`}>
                <ListItemText
                  primary={move.replace(/-/g, ' ')}
                  primaryTypographyProps={{ textTransform: 'capitalize' }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
