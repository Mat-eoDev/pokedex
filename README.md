# Pokedex

Projet Pokedex en Next.js avec PokeAPI, Material-UI et TanStack Query.

---

## Lancer le projet

Le projet doit fonctionner avec les commandes suivantes (rien d’autre à faire à part ça) :

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

pour lancer la version build (comme en prod) :

```bash
npm install
npm run build
npm run start
```

---

## Ce qui est fait

- **Page d’accueil** : liste des 151 premiers Pokémon (cartes avec image, nom, types).
- **Recherche** : par nom (toutes langues) ou par numéro, avec filtre par type (Feu, Eau, etc.).
- **Langue** : choix entre EN, FR, DE, ES, JA (noms des Pokémon + quelques libellés). La langue et la recherche sont gardées dans le localStorage et dans l’URL sur la page d’accueil.
- **Page détail** : en cliquant sur une carte, on va sur `/pokemon/[id]` avec la taille, le poids et un bouton « Voir les attaques » qui ouvre une fenêtre avec la liste des attaques.
- **Page 404** : page personnalisée si l’URL n’existe pas.
- **Logo** : clic sur le logo pour revenir à l’accueil.

---

## Structure du projet

- `src/app/` : pages Next.js (layout, accueil, détail pokemon, 404).
- `src/components/` : composants (Logo, liste, carte, recherche, filtre type, langue).
- `src/context/` : contexte pour la langue et le filtre par type.
- `src/lib/pokeapi.ts` : appels à l’API PokeAPI.
- `src/data/types.json` : couleurs et noms des types selon la langue.

---

## Images à mettre dans `public/images/`

- `pokemon-logo.png` : logo en haut de page.
- `pokeball.png` : image de chargement (pokeball qui tourne).

---

## Déploiement (Vercel)

Le projet est prévu pour être déployé sur Vercel. Après avoir poussé le code sur GitHub

---

## Tests

```bash
npm run test
```

Tests sur quelques composants (sélecteur de langue, carte Pokémon, page 404).
