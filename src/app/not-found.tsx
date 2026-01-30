import Link from 'next/link'
import { Box, Typography, Button } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import PsychologyIcon from '@mui/icons-material/Psychology'

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '6rem', sm: '8rem' },
          fontWeight: 800,
          color: 'primary.main',
          lineHeight: 1,
          letterSpacing: -2,
        }}
      >
        404
      </Typography>
      <PsychologyIcon sx={{ fontSize: 80, color: 'action.disabled', mt: 2, opacity: 0.7 }} aria-hidden />
      <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
        Page introuvable
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 360 }}>
        Ce Pokémon n’existe pas dans ce Pokédex. La page que vous cherchez a peut‑être été déplacée ou n’existe pas.
      </Typography>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Button
        variant="contained"
        startIcon={<HomeIcon />}
        size="large"
        sx={{ mt: 4 }}
      >
        Retour à l’accueil
      </Button>
      </Link>
    </Box>
  )
}
