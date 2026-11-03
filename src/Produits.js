import { useState } from "react";
import { formaterPrix } from "./utils";

export function Etoiles({ note, taille = "" }) {
  const pleines = Math.round(note);
  return (
    <span className={`etoiles ${taille}`} aria-label={`Note ${note} sur 5`}>
      {"★★★★★".slice(0, pleines)}
      <span className="etoiles-vides">{"★★★★★".slice(pleines)}</span>
    </span>
  );
}

function Produit({
  produit,
  ajouterAuPanier,
  onOuvrir,
  favori = false,
  onBasculerFavori,
}) {
  const [imageCassee, setImageCassee] = useState(false);

  const rupture = produit.stock === 0;
  const remise = produit.ancienPrix
    ? Math.round((1 - produit.prix / produit.ancienPrix) * 100)
    : 0;
  const afficherImage = produit.image && !imageCassee;

  return (
    <article className={`carte-produit ${rupture ? "rupture" : ""}`}>
      <div className="zone-image">
        <button
          type="button"
          className="image-produit"
          style={{
            background: `linear-gradient(140deg, ${produit.fond[0]}, ${produit.fond[1]})`,
          }}
          onClick={() => onOuvrir(produit)}
          aria-label={`Voir le détail de ${produit.nom}`}
        >
          {afficherImage ? (
            <img
              src={produit.image}
              alt={produit.nom}
              loading="lazy"
              onError={() => setImageCassee(true)}
            />
          ) : (
            <span className="emoji-produit" aria-hidden="true">
              {produit.emoji}
            </span>
          )}
        </button>

        <div className="badges">
          {remise > 0 && <span className="badge-remise">-{remise} %</span>}
          {produit.nouveau && <span className="badge-nouveau">Nouveau</span>}
        </div>

        <button
          type="button"
          className={`bouton-favori ${favori ? "actif" : ""}`}
          onClick={() => onBasculerFavori(produit.id)}
          aria-pressed={favori}
          aria-label={
            favori
              ? `Retirer ${produit.nom} des favoris`
              : `Ajouter ${produit.nom} aux favoris`
          }
          title={favori ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {favori ? "❤️" : "🤍"}
        </button>

        {rupture && <span className="badge-rupture">Rupture</span>}
      </div>

      <div className="infos-produit">
        <p className="marque">{produit.marque}</p>

        <h3>
          <button
            type="button"
            className="titre-produit"
            onClick={() => onOuvrir(produit)}
          >
            {produit.nom}
          </button>
        </h3>

        <p className="description">{produit.description}</p>

        <p className="avis">
          <Etoiles note={produit.note} />
          <span>
            {produit.note.toFixed(1)} · {produit.avis} avis
          </span>
        </p>

        <p className="prix">
          {formaterPrix(produit.prix)}
          {produit.ancienPrix && (
            <span className="ancien-prix">{formaterPrix(produit.ancienPrix)}</span>
          )}
        </p>

        <p className={`disponible ${rupture ? "indisponible" : ""}`}>
          <span></span>
          {rupture ? "Épuisé" : `En stock (${produit.stock})`}
        </p>

        <button
          type="button"
          className="bouton-panier"
          onClick={() => ajouterAuPanier(produit)}
          disabled={rupture}
        >
          {rupture ? "Indisponible" : "🛒 Ajouter au panier"}
        </button>
      </div>
    </article>
  );
}

export default Produit;
