import { useEffect, useState } from "react";
import Modal from "./Modal";
import { Etoiles } from "./Produits";
import { calculerRemise, formaterPrix } from "./utils";

function FicheProduit({
  produit,
  ouvert,
  onFermer,
  onAjouter,
  favori,
  onBasculerFavori,
  similaires = [],
  onChoisir,
}) {
  const [quantite, setQuantite] = useState(1);
  const [imageCassee, setImageCassee] = useState(false);

  // À chaque nouveau produit ouvert, on repart de 1 et on retente l'image
  useEffect(() => {
    setQuantite(1);
    setImageCassee(false);
  }, [produit]);

  if (!produit) return null;

  const rupture = produit.stock === 0;
  const remise = calculerRemise(produit.prix, produit.ancienPrix);
  const afficherImage = produit.image && !imageCassee;

  function ajouter() {
    onAjouter(produit, quantite);
    onFermer();
  }

  return (
    <Modal
      ouvert={ouvert}
      onFermer={onFermer}
      variante="centre"
      classe="fiche-produit"
      etiquette={`Détail de ${produit.nom}`}
    >
      <button
        type="button"
        className="fermer-modale"
        onClick={onFermer}
        aria-label="Fermer le détail du produit"
      >
        ✕
      </button>

      <div className="fiche-visuel">
        <div
          className="fiche-image"
          style={{
            background: `linear-gradient(140deg, ${produit.fond[0]}, ${produit.fond[1]})`,
          }}
        >
          {afficherImage ? (
            <img
              src={produit.image}
              alt={produit.nom}
              onError={() => setImageCassee(true)}
            />
          ) : (
            <span className="emoji-produit grand" aria-hidden="true">
              {produit.emoji}
            </span>
          )}
        </div>
        <div className="badges">
          {remise > 0 && <span className="badge-remise">-{remise} %</span>}
          {produit.nouveau && <span className="badge-nouveau">Nouveau</span>}
        </div>
      </div>

      <div className="fiche-infos">
        <p className="marque">{produit.marque}</p>
        <h2>{produit.nom}</h2>

        <p className="avis">
          <Etoiles note={produit.note} />
          <span>
            {produit.note.toFixed(1)} sur 5 · {produit.avis} avis clients
          </span>
        </p>

        <p className="prix fiche-prix">
          {formaterPrix(produit.prix)}
          {produit.ancienPrix && (
            <span className="ancien-prix">{formaterPrix(produit.ancienPrix)}</span>
          )}
        </p>

        <p className="fiche-description">{produit.description}</p>

        <ul className="points-forts">
          <li>🚚 Livraison en 24 à 48 h</li>
          <li>💵 Paiement à la livraison</li>
          <li>↩️ Retour gratuit sous 7 jours</li>
        </ul>

        <p className={`disponible ${rupture ? "indisponible" : ""}`}>
          <span></span>
          {rupture ? "Épuisé" : `${produit.stock} en stock`}
        </p>

        <div className="fiche-actions">
          <div className="quantite grande">
            <button
              type="button"
              onClick={() => setQuantite((q) => Math.max(1, q - 1))}
              aria-label="Réduire la quantité"
              disabled={quantite <= 1}
            >
              −
            </button>
            <span aria-live="polite">{quantite}</span>
            <button
              type="button"
              onClick={() => setQuantite((q) => Math.min(produit.stock, q + 1))}
              aria-label="Augmenter la quantité"
              disabled={quantite >= produit.stock}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="bouton-panier fiche-bouton"
            onClick={ajouter}
            disabled={rupture}
          >
            {rupture ? "Produit indisponible" : `Ajouter · ${formaterPrix(produit.prix * quantite)}`}
          </button>

          <button
            type="button"
            className={`bouton-favori-texte ${favori ? "actif" : ""}`}
            onClick={() => onBasculerFavori(produit.id)}
            aria-pressed={favori}
          >
            {favori ? "❤️ Dans mes favoris" : "🤍 Ajouter aux favoris"}
          </button>
        </div>

        {similaires.length > 0 && (
          <div className="similaires">
            <h3>Vous aimerez aussi</h3>
            <div className="similaires-liste">
              {similaires.map((autre) => (
                <button
                  key={autre.id}
                  type="button"
                  className="similaire"
                  onClick={() => onChoisir(autre)}
                >
                  <img src={autre.image} alt="" loading="lazy" />
                  <span>{autre.nom}</span>
                  <strong>{formaterPrix(autre.prix)}</strong>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default FicheProduit;
