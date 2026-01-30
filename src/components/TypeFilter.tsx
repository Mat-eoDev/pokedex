'use client'

import { FormControl, InputLabel, Select, MenuItem, Chip, Box } from '@mui/material'
import { useTypeFilter } from '@/context/TypeFilterContext'
import { useLanguage } from '@/context/LanguageContext'
import { TYPE_KEYS } from '@/context/TypeFilterContext'
import typesData from '@/data/types.json'

const TYPES_DATA: Record<
  string,
  { backgroundColor: string; translations: Record<string, string> }
> = typesData as never

function getTypeName(typeKey: string, language: string): string {
  const type = TYPES_DATA[typeKey]
  return type?.translations?.[language] ?? type?.translations?.en ?? typeKey
}

export function TypeFilter() {
  const { language } = useLanguage()
  const { selectedTypes, setSelectedTypes } = useTypeFilter()

  return (
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <InputLabel id="type-filter-label">Type</InputLabel>
      <Select
        labelId="type-filter-label"
        id="type-filter"
        multiple
        value={selectedTypes}
        label="Type"
        onChange={(e) => setSelectedTypes(e.target.value as string[])}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(selected as string[]).map((key) => (
              <Chip
                key={key}
                label={getTypeName(key, language)}
                size="small"
                sx={{
                  backgroundColor: TYPES_DATA[key]?.backgroundColor ?? '#999',
                  color: 'white',
                }}
              />
            ))}
          </Box>
        )}
      >
        {TYPE_KEYS.map((key) => (
          <MenuItem key={key} value={key}>
            {getTypeName(key, language)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
