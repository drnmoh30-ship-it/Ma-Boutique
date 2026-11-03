import { useEffect, useState } from "react";

export const SEUIL_LIVRAISON_GRATUITE = 300;
export const FRAIS_LIVRAISON = 30;

const CLE_STOCKAGE = "boutique-panier-v1";

// Le panier est stocké sous la forme [{ id, quantite }, ...]
function lirePanier() {
  try {
    const donnees = JSON.parse(localStorage.getItem(CLE_STOCKAGE) || "[]");
    if (!Array.isArray(donnees)) return [];
    return donnees.filter(
      (ligne) =>
        ligne &&
        Number.isInteger(ligne.id) &&
        Number.isInteger(ligne.quantite) &&
        ligne.quantite > 0
    );
  } catch {
    return [];
  }
}

/**
 * Gère tout l'état du panier : ajout, quantités, suppression, totaux
 * et sauvegarde automatique dans le localStorage.
 */
export default function usePanier(catalogue) {
  const [panier, setPanier] = useState(lirePanier);

  useEffect(() => {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(panier));
    } catch {
      // stockage indisponible (navigation privée) : on continue sans persistance
    }
  }, [panier]);

  // On enrichit chaque ligne avec les infos du produit (nom, prix, image…)
  const lignes = panier
    .map((ligne) => {
      const produit = catalogue.find((p) => p.id === ligne.id);
      return produit ? { ...produit, quantite: ligne.quantite } : null;
    })
    .filter(Boolean);

  const nombreArticles = lignes.reduce((total, ligne) => total + ligne.quantite, 0);
  const sousTotal = lignes.reduce(
    (total, ligne) => total + ligne.prix * ligne.quantite,
    0
  );
  const frais =
    lignes.length === 0 || sousTotal >= SEUIL_LIVRAISON_GRATUITE ? 0 : FRAIS_LIVRAISON;
  const total = sousTotal + frais;
  const restePourLivraisonGratuite = Math.max(0, SEUIL_LIVRAISON_GRATUITE - sousTotal);

  function ajouter(produit, quantite = 1) {
    if (!produit || produit.stock === 0) return;

    setPanier((ancien) => {
      const existant = ancien.find((ligne) => ligne.id === produit.id);
      if (existant) {
        return ancien.map((ligne) =>
          ligne.id === produit.id
            ? {
                ...ligne,
                quantite: Math.min(ligne.quantite + quantite, produit.stock),
              }
            : ligne
        );
      }
      return [
        ...ancien,
        { id: produit.id, quantite: Math.min(quantite, produit.stock) },
      ];
    });
  }

  function changerQuantite(id, delta) {
    const produit = catalogue.find((p) => p.id === id);
    const maximum = produit ? produit.stock : 99;

    setPanier((ancien) =>
      ancien
        .map((ligne) =>
          ligne.id === id
            ? {
                ...ligne,
                quantite: Math.max(0, Math.min(ligne.quantite + delta, maximum)),
              }
            : ligne
        )
        .filter((ligne) => ligne.quantite > 0)
    );
  }

  function retirer(id) {
    setPanier((ancien) => ancien.filter((ligne) => ligne.id !== id));
  }

  function vider() {
    setPanier([]);
  }

  return {
    lignes,
    nombreArticles,
    sousTotal,
    frais,
    total,
    restePourLivraisonGratuite,
    ajouter,
    changerQuantite,
    retirer,
    vider,
  };
}
