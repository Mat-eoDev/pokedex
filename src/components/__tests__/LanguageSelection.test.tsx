import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageSelection } from '../LanguageSelection'
import { LanguageProvider } from '@/context/LanguageContext'

function renderWithProvider() {
  return render(
    <LanguageProvider>
      <LanguageSelection />
    </LanguageProvider>
  )
}

describe('LanguageSelection', () => {
  it('affiche le sélecteur de langue', () => {
    renderWithProvider()
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument()
  })

  it('affiche la valeur par défaut English', () => {
    renderWithProvider()
    expect(screen.getByRole('combobox')).toHaveTextContent('English')
  })

  it('permet de changer de langue', async () => {
    renderWithProvider()
    const select = screen.getByRole('combobox')
    fireEvent.mouseDown(select)
    const option = await screen.findByRole('option', { name: /français/i })
    fireEvent.click(option)
    expect(screen.getByRole('combobox')).toHaveTextContent('Français')
  })
})
