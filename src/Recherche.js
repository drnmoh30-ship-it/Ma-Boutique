function Recherche({
  recherche,
  setRecherche,
  categorie,
  setCategorie,
  tri,
  setTri,
  categories,
  filtreFavoris,
  onBasculerFiltreFavoris,
  nombreFavoris,
}) {
  return (
    <div className="recherche">
      <div className="champ-recherche">
        <span className="icone-loupe" aria-hidden="true">
          🔍
        </span>
        <input
          type="search"
          placeholder="Rechercher un produit, une marque..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          aria-label="Rechercher un produit"
        />
        {recherche && (
          <button
            type="button"
            className="effacer-recherche"
            onClick={() => setRecherche("")}
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filtres">
        <div className="puces" role="group" aria-label="Filtrer par catégorie">
          <button
            type="button"
            className={`puce puce-favoris ${filtreFavoris ? "active" : ""}`}
            onClick={onBasculerFiltreFavoris}
            aria-pressed={filtreFavoris}
          >
            ❤️ Favoris
            {nombreFavoris > 0 && <span className="puce-compteur">{nombreFavoris}</span>}
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`puce ${categorie === cat ? "active" : ""}`}
              onClick={() => setCategorie(cat)}
              aria-pressed={categorie === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          className="tri"
          value={tri}
          onChange={(e) => setTri(e.target.value)}
          aria-label="Trier les produits"
        >
          <option value="populaire">Les plus populaires</option>
          <option value="prix-croissant">Prix croissant</option>
          <option value="prix-decroissant">Prix décroissant</option>
          <option value="note">Meilleures notes</option>
        </select>
      </div>
    </div>
  );
}

export default Recherche;
