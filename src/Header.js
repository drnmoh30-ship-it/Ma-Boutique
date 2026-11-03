function Entete({ nombrePanier, nombreFavoris, onOuvrirPanier, onVoirFavoris }) {
  return (
    <header className="entete">
      <div className="entete-texte">
        <h1>
          <span className="logo-marque" aria-hidden="true">
            🛍️
          </span>{" "}
          Ma Boutique React
        </h1>
        <p>Des produits de qualité à prix doux</p>
      </div>

      <div className="entete-actions">
        <button
          type="button"
          className="bouton-icone"
          onClick={onVoirFavoris}
          aria-label={`Voir mes favoris, ${nombreFavoris} produit${
            nombreFavoris > 1 ? "s" : ""
          }`}
        >
          <span aria-hidden="true">❤️</span>
          <span className="libelle-icone">Favoris</span>
          {nombreFavoris > 0 && <span className="compteur favoris">{nombreFavoris}</span>}
        </button>

        <button
          type="button"
          className="bouton-icone panier-bouton"
          onClick={onOuvrirPanier}
          aria-label={`Ouvrir le panier, ${nombrePanier} article${
            nombrePanier > 1 ? "s" : ""
          }`}
        >
          <span aria-hidden="true">🛒</span>
          <span className="libelle-icone">Panier</span>
          {nombrePanier > 0 && <span className="compteur">{nombrePanier}</span>}
        </button>
      </div>
    </header>
  );
}

export default Entete;
