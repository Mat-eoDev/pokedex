import { PokemonDetailClient } from './PokemonDetailClient'

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PokemonDetailClient id={id} />
}
