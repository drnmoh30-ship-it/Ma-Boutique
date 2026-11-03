# 🛍️ Ma Boutique React

Boutique en ligne (démo professionnelle) de parfums, high-tech et accessoires — 100 % React, sans backend.
Paiement à la livraison, panier persistant, favoris et tunnel de commande avec validation.

## Démarrage

```bash
npm install
npm start        # http://localhost:3000
npm test         # tests unitaires (watch mode)
npm run build    # build de production dans /build
```

## Fonctionnalités

- **Catalogue** : 14 produits, 4 catégories, marque, note/avis, remise calculée automatiquement, stock, badges « -X % » et « Nouveau ».
- **Photos produit locales** (Pexels, libres de droits) : recadrées 4:3, optimisées, avec repli automatique sur un visuel emoji si l'image manque. Voir [CREDITS.md](CREDITS.md).
- **Recherche instantanée** par nom, marque ou catégorie + **filtre par catégorie** (puces).
- **Tri** : popularité, prix croissant/décroissant, meilleures notes.
- **Fiche produit** (modale) : grande photo, prix, description, stock, quantité, ajout au panier, favoris et rubrique « Vous aimerez aussi ».
- **Favoris** : ajout/retrait depuis la carte ou la fiche, filtre « favoris », persistés.
- **Panier** (tiroir latéral) : quantités +/− limitées au stock, suppression, sous-total, livraison offerte dès 300 DH, total.
- **Commande** : formulaire validé (nom, téléphone marocain, ville, adresse) → récapitulatif → confirmation avec numéro de commande.
- **UX** : notifications avec action « Voir le panier », fermeture des modales par `Échap` / clic extérieur, scroll bloqué, responsive mobile/tablette.

## Structure

```
src/
├── App.js              # État global : filtres, panier, favoris, modales
├── produitsData.js     # Catalogue + constantes de catégories
├── Header.js           # En-tête (favoris + panier)
├── Recherche.js        # Barre de recherche, puces de catégories, tri
├── ListeProduits.js    # Grille + état vide
├── Produits.js         # Carte produit (+ Etoiles exporté)
├── FicheProduit.js     # Modale détail produit
├── Panier.js           # Tiroir panier
├── Commande.js         # Formulaire + confirmation de commande
├── Modal.js            # Modale générique accessible
├── utils.js            # Formatage prix / pourcentages, validation téléphone
├── utils.test.js       # Tests unitaires des utilitaires
├── hooks/
│   ├── usePanier.js    # Logique panier + persistance localStorage
│   └── useFavoris.js   # Liste de souhaits + persistance
├── App.css             # Styles (variables CSS, responsive)
└── index.js            # Point d'entrée

public/images/produits/ # 14 photos produits (p01.jpg … p14.jpg)
```

## Données

Tout le catalogue est dans `src/produitsData.js`. Un produit :

```js
{
  id: 1,                      // entier unique
  nom: "…",
  marque: "…",
  categorie: "Parfum",        // doit exister dans CATEGORIES
  prix: 150,                  // en DH
  ancienPrix: 199,            // null si pas de promo
  note: 4.8,                  // 0 à 5
  avis: 214,
  stock: 12,                  // 0 = rupture (bouton désactivé)
  emoji: "🌙",                // visuel de secours
  fond: ["#1f2a44", "#4a5f8f"],// dégradé du visuel
  image: "https://…",         // optionnel (null = emoji seul)
  description: "…",
}
```

Le panier est stocké sous `boutique-panier-v1` (uniquement `{ id, quantite }`), les favoris sous `boutique-favoris-v1`.
Pour brancher une API réelle, remplacer `produitsData.js` par un `fetch` et adapter `usePanier` (les composants ne changent pas).

## Qualité

- Aucun warning de build, aucun `console.error` à l'exécution (vérifié au navigateur).
- Composants accessibles : `aria-label`, `aria-pressed`, `aria-live`, `role="dialog"`, labels liés aux champs.
- Test de fumée dans `src/App.test.js`.
