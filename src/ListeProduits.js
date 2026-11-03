import Produit from "./Produits";

function ListeProduits({
  produits,
  ajouterAuPanier,
  onOuvrir,
  favoris,
  onBasculerFavori,
  filtreFavoris,
  onReinitialiser,
}) {
  if (produits.length === 0) {
    return (
      <div className="aucun-produit">
        <span aria-hidden="true">🔎</span>
        <p>
          {filtreFavoris
            ? "Aucun produit dans vos favoris pour cette sélection."
            : "Aucun produit ne correspond à votre recherche."}
        </p>
        <button type="button" className="bouton-secondaire" onClick={onReinitialiser}>
          Réinitialiser les filtres
        </button>
      </div>
    );
  }

  return (
    <div className="liste-produits">
      {produits.map((produit) => (
        <Produit
          key={produit.id}
          produit={produit}
          ajouterAuPanier={ajouterAuPanier}
          onOuvrir={onOuvrir}
          favori={favoris.includes(produit.id)}
          onBasculerFavori={onBasculerFavori}
        />
      ))}
    </div>
  );
}

export default ListeProduits;
