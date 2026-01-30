'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  CircularProgress,
} from '@mui/material'
import typesData from '@/data/types.json'
import { useLanguage } from '@/context/LanguageContext'
import type { PokeApiPokemon } from '@/lib/pokeapi'

const TYPES_DATA: Record<
  string,
  { backgroundColor: string; translations: Record<string, string> }
> = typesData as never

interface PokemonCardProps {
  pokemon: PokeApiPokemon
  displayName?: string
}

function getTypeName(typeKey: string, language: string): string {
  const type = TYPES_DATA[typeKey]
  return type?.translations?.[language] ?? type?.translations?.en ?? typeKey
}

function getTypeColor(typeKey: string): string {
  const type = TYPES_DATA[typeKey]
  return type?.backgroundColor ?? '#A8A77A'
}

export function PokemonCard({ pokemon, displayName }: PokemonCardProps) {
  const { language } = useLanguage()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [pokeballError, setPokeballError] = useState(false)
  const [showPokeball, setShowPokeball] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  const name = displayName ?? pokemon.name
  const imageUrl =
    pokemon.sprites?.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`

  useEffect(() => {
    setImageLoaded(false)
    setShowPokeball(true)
    setImageError(false)
    if (imgRef.current?.complete) {
      const t = setTimeout(() => {
        setImageLoaded(true)
        setShowPokeball(false)
      }, 100)
      return () => clearTimeout(t)
    }
  }, [imageUrl])

  const handleImageLoad = () => {
    setTimeout(() => {
      setImageLoaded(true)
      setShowPokeball(false)
    }, 100)
  }

  return (
    <Card
      component={Link}
      href={`/pokemon/${pokemon.id}`}
      sx={{
        width: 280,
        height: 380,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        borderRadius: 3,
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        '&:hover': { transform: 'translateY(-8px)', boxShadow: 6 },
      }}
    >
      <Box sx={{ position: 'relative', p: 1.5, flexShrink: 0 }}>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: 'text.secondary',
            fontWeight: 600,
            zIndex: 1,
            fontSize: '0.9rem',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            px: 1,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          #{String(pokemon.id).padStart(3, '0')}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.50',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {showPokeball && !imageError && (
            <Box sx={{ position: 'absolute', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!pokeballError ? (
                <Box
                  component="img"
                  src="/images/pokeball.png"
                  alt=""
                  sx={{
                    width: 100,
                    height: 100,
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
                  }}
                  onError={() => setPokeballError(true)}
                />
              ) : (
                <CircularProgress size={60} />
              )}
            </Box>
          )}
          <CardMedia
            component="img"
            image={imageUrl}
            alt={name}
            ref={imgRef}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={() => setImageError(true)}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
          {imageError && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ p: 2 }}>
              Image non disponible
            </Typography>
          )}
        </Box>
      </Box>
      <CardContent
        sx={{
          flexGrow: 1,
          pt: 1.5,
          pb: 2,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 160,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          align="center"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            textTransform: 'capitalize',
            fontSize: '1.25rem',
            minHeight: 48,
            wordBreak: 'break-word',
          }}
        >
          {name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', mt: 'auto' }}>
          {pokemon.types?.map((t) => (
            <Chip
              key={t.type.name}
              label={getTypeName(t.type.name, language)}
              sx={{
                backgroundColor: getTypeColor(t.type.name),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.875rem',
                height: 32,
                px: 1,
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
