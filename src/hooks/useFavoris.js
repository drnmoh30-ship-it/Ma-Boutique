import { useEffect, useState } from "react";

const CLE_STOCKAGE = "boutique-favoris-v1";

function lireFavoris() {
  try {
    const donnees = JSON.parse(localStorage.getItem(CLE_STOCKAGE) || "[]");
    return Array.isArray(donnees)
      ? donnees.filter((id) => Number.isInteger(id))
      : [];
  } catch {
    return [];
  }
}

/** Liste de souhaits persistée dans le localStorage. */
export default function useFavoris() {
  const [favoris, setFavoris] = useState(lireFavoris);

  useEffect(() => {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(favoris));
    } catch {
      // stockage indisponible : on ignore
    }
  }, [favoris]);

  function basculer(id) {
    setFavoris((anciens) =>
      anciens.includes(id)
        ? anciens.filter((favori) => favori !== id)
        : [...anciens, id]
    );
  }

  return {
    favoris,
    nombreFavoris: favoris.length,
    estFavori: (id) => favoris.includes(id),
    basculer,
  };
}
