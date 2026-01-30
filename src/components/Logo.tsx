import Link from 'next/link'
import { Box } from '@mui/material'

export function Logo() {
  return (
    <Box
      component={Link}
      href="/"
      sx={{
        display: 'block',
        height: 50,
        width: 'auto',
        lineHeight: 0,
      }}
    >
      <Box
        component="img"
        src="/images/pokemon-logo.png"
        alt="Pokedex"
        sx={{
          height: 50,
          width: 'auto',
          objectFit: 'contain',
        }}
      />
    </Box>
  )
}
