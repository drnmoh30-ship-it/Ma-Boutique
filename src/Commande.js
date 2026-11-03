import { useEffect, useState } from "react";
import Modal from "./Modal";
import {
  formaterPrix,
  genererNumeroCommande,
  telephoneValide,
} from "./utils";

const VILLES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Salé",
  "El Jadida",
  "Autre ville",
];

const CHAMPS_VIDES = { nom: "", telephone: "", ville: "", adresse: "" };

function Commande({ ouvert, onFermer, lignes, total, nombreArticles, onValider }) {
  const [etape, setEtape] = useState("formulaire");
  const [champs, setChamps] = useState(CHAMPS_VIDES);
  const [erreurs, setErreurs] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  // Réinitialise le formulaire à chaque ouverture
  useEffect(() => {
    if (ouvert) {
      setEtape("formulaire");
      setErreurs({});
    }
  }, [ouvert]);

  function majChamp(nom, valeur) {
    setChamps((anciens) => ({ ...anciens, [nom]: valeur }));
    setErreurs((anciennes) => ({ ...anciennes, [nom]: undefined }));
  }

  function valider(e) {
    e.preventDefault();

    const nouvellesErreurs = {};
    if (champs.nom.trim().length < 3) {
      nouvellesErreurs.nom = "Indiquez votre nom complet (3 caractères minimum).";
    }
    if (!telephoneValide(champs.telephone)) {
      nouvellesErreurs.telephone = "Numéro invalide (ex : 0612345678).";
    }
    if (!champs.ville) {
      nouvellesErreurs.ville = "Choisissez votre ville de livraison.";
    }
    if (champs.adresse.trim().length < 8) {
      nouvellesErreurs.adresse = "Adresse trop courte : précisez rue et numéro.";
    }

    setErreurs(nouvellesErreurs);
    if (Object.keys(nouvellesErreurs).length > 0) return;

    setConfirmation({
      numero: genererNumeroCommande(),
      total,
      articles: nombreArticles,
      client: champs.nom.trim(),
      ville: champs.ville,
    });
    setEtape("confirmation");
    setChamps(CHAMPS_VIDES);
    onValider();
  }

  return (
    <Modal
      ouvert={ouvert}
      onFermer={onFermer}
      variante="centre"
      classe="commande"
      etiquette="Finaliser la commande"
    >
      <div className="commande-entete">
        <h2>{etape === "formulaire" ? "Finaliser la commande" : "Commande confirmée"}</h2>
        <button
          type="button"
          className="fermer-panier"
          onClick={onFermer}
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      {etape === "formulaire" && lignes.length === 0 ? (
        <div className="panier-vide">
          <span aria-hidden="true">🧺</span>
          <p>Votre panier est vide.</p>
          <button type="button" className="bouton-secondaire" onClick={onFermer}>
            Retour à la boutique
          </button>
        </div>
      ) : etape === "confirmation" && confirmation ? (
        <div className="confirmation">
          <div className="confirmation-icone" aria-hidden="true">
            ✅
          </div>
          <h3>Merci {confirmation.client} !</h3>
          <p>
            Votre commande <strong>{confirmation.numero}</strong> est enregistrée.
            Nous vous appelons pour confirmer la livraison à{" "}
            <strong>{confirmation.ville}</strong>.
          </p>

          <div className="confirmation-resume">
            <div className="resume-ligne">
              <span>Articles</span>
              <span>{confirmation.articles}</span>
            </div>
            <div className="resume-ligne total">
              <span>À payer à la livraison</span>
              <span>{formaterPrix(confirmation.total)}</span>
            </div>
          </div>

          <button type="button" className="bouton-commander" onClick={onFermer}>
            Continuer mes achats
          </button>
        </div>
      ) : (
        <form className="commande-form" onSubmit={valider} noValidate>
          <p className="commande-intro">
            Paiement à la livraison · {nombreArticles} article
            {nombreArticles > 1 ? "s" : ""} · Total{" "}
            <strong>{formaterPrix(total)}</strong>
          </p>

          <div className={`champ ${erreurs.nom ? "en-erreur" : ""}`}>
            <label htmlFor="nom">Nom complet</label>
            <input
              id="nom"
              type="text"
              autoComplete="name"
              placeholder="Ex : Youssef El Amrani"
              value={champs.nom}
              onChange={(e) => majChamp("nom", e.target.value)}
              aria-invalid={Boolean(erreurs.nom)}
              aria-describedby={erreurs.nom ? "erreur-nom" : undefined}
            />
            {erreurs.nom && (
              <p className="erreur" id="erreur-nom">
                {erreurs.nom}
              </p>
            )}
          </div>

          <div className="champ-groupe">
            <div className={`champ ${erreurs.telephone ? "en-erreur" : ""}`}>
              <label htmlFor="telephone">Téléphone</label>
              <input
                id="telephone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0612345678"
                value={champs.telephone}
                onChange={(e) => majChamp("telephone", e.target.value)}
                aria-invalid={Boolean(erreurs.telephone)}
                aria-describedby={erreurs.telephone ? "erreur-telephone" : undefined}
              />
              {erreurs.telephone && (
                <p className="erreur" id="erreur-telephone">
                  {erreurs.telephone}
                </p>
              )}
            </div>

            <div className={`champ ${erreurs.ville ? "en-erreur" : ""}`}>
              <label htmlFor="ville">Ville</label>
              <select
                id="ville"
                value={champs.ville}
                onChange={(e) => majChamp("ville", e.target.value)}
                aria-invalid={Boolean(erreurs.ville)}
                aria-describedby={erreurs.ville ? "erreur-ville" : undefined}
              >
                <option value="">Choisir…</option>
                {VILLES.map((ville) => (
                  <option key={ville} value={ville}>
                    {ville}
                  </option>
                ))}
              </select>
              {erreurs.ville && (
                <p className="erreur" id="erreur-ville">
                  {erreurs.ville}
                </p>
              )}
            </div>
          </div>

          <div className={`champ ${erreurs.adresse ? "en-erreur" : ""}`}>
            <label htmlFor="adresse">Adresse de livraison</label>
            <textarea
              id="adresse"
              rows={2}
              autoComplete="street-address"
              placeholder="Rue, numéro, quartier…"
              value={champs.adresse}
              onChange={(e) => majChamp("adresse", e.target.value)}
              aria-invalid={Boolean(erreurs.adresse)}
              aria-describedby={erreurs.adresse ? "erreur-adresse" : undefined}
            />
            {erreurs.adresse && (
              <p className="erreur" id="erreur-adresse">
                {erreurs.adresse}
              </p>
            )}
          </div>

          <div className="commande-recap">
            {lignes.map((ligne) => (
              <div className="resume-ligne" key={ligne.id}>
                <span>
                  {ligne.quantite} × {ligne.nom}
                </span>
                <span>{formaterPrix(ligne.prix * ligne.quantite)}</span>
              </div>
            ))}
          </div>

          <button type="submit" className="bouton-commander">
            Confirmer · {formaterPrix(total)}
          </button>
          <p className="commande-note">
            Aucun paiement en ligne : vous payez le livreur à la réception.
          </p>
        </form>
      )}
    </Modal>
  );
}

export default Commande;
