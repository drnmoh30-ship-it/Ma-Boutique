import Modal from "./Modal";
import { formaterPrix } from "./utils";
import { SEUIL_LIVRAISON_GRATUITE } from "./hooks/usePanier";

function Panier({
  ouvert,
  onFermer,
  lignes,
  nombreArticles,
  sousTotal,
  frais,
  total,
  restePourLivraisonGratuite,
  changerQuantite,
  retirer,
  vider,
  onCommander,
}) {
  return (
    <Modal
      ouvert={ouvert}
      onFermer={onFermer}
      variante="droite"
      classe="panier"
      etiquette="Mon panier"
    >
      <div className="panier-entete">
        <h2>
          Mon panier{" "}
          {nombreArticles > 0 && <span className="pastille">{nombreArticles}</span>}
        </h2>
        <button
          type="button"
          className="fermer-panier"
          onClick={onFermer}
          aria-label="Fermer le panier"
        >
          ✕
        </button>
      </div>

      {lignes.length === 0 ? (
        <div className="panier-vide">
          <span aria-hidden="true">🧺</span>
          <p>Votre panier est vide.</p>
          <p className="panier-vide-aide">
            Ajoutez des produits pour profiter de la livraison offerte dès{" "}
            {formaterPrix(SEUIL_LIVRAISON_GRATUITE)}.
          </p>
          <button type="button" className="bouton-secondaire" onClick={onFermer}>
            Continuer mes achats
          </button>
        </div>
      ) : (
        <>
          <ul className="panier-lignes">
            {lignes.map((ligne) => (
              <li key={ligne.id} className="ligne-panier">
                <span
                  className="vignette"
                  aria-hidden="true"
                  style={{
                    background: `linear-gradient(140deg, ${ligne.fond[0]}, ${ligne.fond[1]})`,
                  }}
                >
                  {ligne.image ? (
                    <img src={ligne.image} alt="" loading="lazy" />
                  ) : (
                    ligne.emoji
                  )}
                </span>

                <div className="ligne-infos">
                  <p className="ligne-nom">{ligne.nom}</p>
                  <p className="ligne-prix">{formaterPrix(ligne.prix)}</p>

                  <div className="quantite">
                    <button
                      type="button"
                      onClick={() => changerQuantite(ligne.id, -1)}
                      aria-label={`Retirer un exemplaire de ${ligne.nom}`}
                    >
                      −
                    </button>
                    <span aria-live="polite">{ligne.quantite}</span>
                    <button
                      type="button"
                      onClick={() => changerQuantite(ligne.id, 1)}
                      disabled={ligne.quantite >= ligne.stock}
                      aria-label={`Ajouter un exemplaire de ${ligne.nom}`}
                    >
                      +
                    </button>
                  </div>

                  {ligne.quantite >= ligne.stock && (
                    <p className="stock-max">Stock maximum atteint</p>
                  )}
                </div>

                <div className="ligne-droite">
                  <p className="ligne-total">
                    {formaterPrix(ligne.prix * ligne.quantite)}
                  </p>
                  <button
                    type="button"
                    className="retirer"
                    onClick={() => retirer(ligne.id)}
                    aria-label={`Retirer ${ligne.nom} du panier`}
                    title="Retirer du panier"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="panier-pied">
            {restePourLivraisonGratuite > 0 ? (
              <p className="info-livraison">
                Plus que{" "}
                <strong>{formaterPrix(restePourLivraisonGratuite)}</strong> pour la
                livraison offerte 🚚
              </p>
            ) : (
              <p className="info-livraison gratuite">Livraison offerte 🎉</p>
            )}

            <div className="resume-ligne">
              <span>Sous-total</span>
              <span>{formaterPrix(sousTotal)}</span>
            </div>
            <div className="resume-ligne">
              <span>Livraison</span>
              <span>{frais === 0 ? "Gratuite" : formaterPrix(frais)}</span>
            </div>
            <div className="resume-ligne total">
              <span>Total</span>
              <span>{formaterPrix(total)}</span>
            </div>

            <button type="button" className="bouton-commander" onClick={onCommander}>
              Commander · {formaterPrix(total)}
            </button>
            <button type="button" className="bouton-vider" onClick={vider}>
              Vider le panier
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

export default Panier;
