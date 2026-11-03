import { useEffect, useMemo, useRef, useState } from "react";
import Entete from "./Header";
import Recherche from "./Recherche";
import ListeProduits from "./ListeProduits";
import Panier from "./Panier";
import FicheProduit from "./FicheProduit";
import Commande from "./Commande";
import produits, { CATEGORIES } from "./produitsData";
import usePanier, { SEUIL_LIVRAISON_GRATUITE } from "./hooks/usePanier";
import useFavoris from "./hooks/useFavoris";
import { formaterPrix } from "./utils";
import "./App.css";

function App() {
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState(CATEGORIES[0]);
  const [tri, setTri] = useState("populaire");
  const [filtreFavoris, setFiltreFavoris] = useState(false);

  const [panierOuvert, setPanierOuvert] = useState(false);
  const [commandeOuverte, setCommandeOuverte] = useState(false);
  const [produitSelectionne, setProduitSelectionne] = useState(null);

  const [message, setMessage] = useState(null);

  const panier = usePanier(produits);
  const favoris = useFavoris();

  const refProduits = useRef(null);

  // Le message de confirmation disparaît tout seul
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => setMessage(null), message.action ? 4000 : 2400);
    return () => clearTimeout(timer);
  }, [message]);

  const produitsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    const liste = produits.filter((produit) => {
      const correspondRecherche =
        !terme ||
        produit.nom.toLowerCase().includes(terme) ||
        produit.marque.toLowerCase().includes(terme) ||
        produit.categorie.toLowerCase().includes(terme);

      const correspondCategorie =
        categorie === "Tous" || produit.categorie === categorie;

      const correspondFavoris = !filtreFavoris || favoris.favoris.includes(produit.id);

      return correspondRecherche && correspondCategorie && correspondFavoris;
    });

    const tries = [...liste];
    switch (tri) {
      case "prix-croissant":
        tries.sort((a, b) => a.prix - b.prix);
        break;
      case "prix-decroissant":
        tries.sort((a, b) => b.prix - a.prix);
        break;
      case "note":
        tries.sort((a, b) => b.note - a.note);
        break;
      default:
        // "populaire" : les plus commentés d'abord
        tries.sort((a, b) => b.avis - a.avis);
    }
    return tries;
  }, [recherche, categorie, tri, filtreFavoris, favoris.favoris]);

  function defilerVersProduits() {
    refProduits.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function ajouterAuPanier(produit, quantite = 1) {
    if (produit.stock === 0) return;
    panier.ajouter(produit, quantite);
    setMessage({
      texte: `${produit.nom} ajouté au panier ✅`,
      action: "panier",
    });
  }

  function basculerFavori(id) {
    const etaitFavori = favoris.favoris.includes(id);
    favoris.basculer(id);
    setMessage({
      texte: etaitFavori ? "Retiré de vos favoris" : "Ajouté à vos favoris ❤️",
      action: null,
    });
  }

  function voirFavoris() {
    setFiltreFavoris(true);
    setCategorie(CATEGORIES[0]);
    setRecherche("");
    defilerVersProduits();
  }

  function reinitialiserFiltres() {
    setRecherche("");
    setCategorie(CATEGORIES[0]);
    setFiltreFavoris(false);
    setTri("populaire");
  }

  function ouvrirCommande() {
    setPanierOuvert(false);
    setCommandeOuverte(true);
  }

  function validerCommande() {
    panier.vider();
    setMessage({ texte: "Merci ! Votre commande est enregistrée 🎉", action: null });
  }

  return (
    <div className="app">
      <Entete
        nombrePanier={panier.nombreArticles}
        nombreFavoris={favoris.nombreFavoris}
        onOuvrirPanier={() => setPanierOuvert(true)}
        onVoirFavoris={voirFavoris}
      />

      <main className="contenu">
        <section className="hero">
          <div className="hero-texte">
            <span className="hero-etiquette">
              🚚 Livraison offerte dès {formaterPrix(SEUIL_LIVRAISON_GRATUITE)}
            </span>
            <h2>
              Des parfums et du high-tech, <br />
              livrés chez vous en 48 h.
            </h2>
            <p>
              Sélection de produits testés, paiement à la livraison et retour gratuit
              sous 7 jours. Simple, rapide, sans surprise.
            </p>
            <div className="hero-actions">
              <button type="button" className="bouton-principal" onClick={defilerVersProduits}>
                Découvrir les produits
              </button>
              <button type="button" className="bouton-ghost" onClick={voirFavoris}>
                ❤️ Mes favoris
              </button>
            </div>
          </div>

          <div className="hero-visuel" aria-hidden="true">
            <img className="hero-photo photo-1" src="/images/produits/p01.jpg" alt="" />
            <img className="hero-photo photo-2" src="/images/produits/p05.jpg" alt="" />
            <img className="hero-photo photo-3" src="/images/produits/p10.jpg" alt="" />
            <span className="hero-note">
              <strong>4,7/5</strong>
              <span>1 200+ avis clients</span>
            </span>
          </div>
        </section>

        <div className="avantages">
          <div className="avantage">
            <span aria-hidden="true">🚚</span>
            <div>
              <strong>Livraison 24-48 h</strong>
              <p>Partout au Maroc</p>
            </div>
          </div>
          <div className="avantage">
            <span aria-hidden="true">💵</span>
            <div>
              <strong>Paiement à la livraison</strong>
              <p>Vous payez à réception</p>
            </div>
          </div>
          <div className="avantage">
            <span aria-hidden="true">↩️</span>
            <div>
              <strong>Retour 7 jours</strong>
              <p>Échange gratuit</p>
            </div>
          </div>
          <div className="avantage">
            <span aria-hidden="true">🔒</span>
            <div>
              <strong>Achat sécurisé</strong>
              <p>Données protégées</p>
            </div>
          </div>
        </div>

        <section id="produits" ref={refProduits}>
          <div className="titre-section">
            <h2>{filtreFavoris ? "Mes favoris" : "Nos produits"}</h2>
            <p>
              {produitsFiltres.length} produit
              {produitsFiltres.length > 1 ? "s" : ""} affiché
              {produitsFiltres.length > 1 ? "s" : ""}
            </p>
          </div>

          <Recherche
            recherche={recherche}
            setRecherche={setRecherche}
            categorie={categorie}
            setCategorie={setCategorie}
            tri={tri}
            setTri={setTri}
            categories={CATEGORIES}
            filtreFavoris={filtreFavoris}
            onBasculerFiltreFavoris={() => setFiltreFavoris((v) => !v)}
            nombreFavoris={favoris.nombreFavoris}
          />

          <ListeProduits
            produits={produitsFiltres}
            ajouterAuPanier={ajouterAuPanier}
            onOuvrir={setProduitSelectionne}
            favoris={favoris.favoris}
            onBasculerFavori={basculerFavori}
            filtreFavoris={filtreFavoris}
            onReinitialiser={reinitialiserFiltres}
          />
        </section>
      </main>

      <footer className="pied-page">
        <div className="pied-grille">
          <div>
            <h3>🛍️ Ma Boutique React</h3>
            <p>
              Boutique en ligne de parfums, high-tech et accessoires. Sélection
              soignée, prix justes, service client réactif.
            </p>
          </div>
          <div>
            <h4>Boutique</h4>
            <ul>
              {CATEGORIES.filter((c) => c !== "Tous").map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => {
                      setCategorie(cat);
                      setFiltreFavoris(false);
                      defilerVersProduits();
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Aide</h4>
            <ul>
              <li>Livraison &amp; délais</li>
              <li>Retours et échanges</li>
              <li>Paiement à la livraison</li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>📞 06 00 00 00 00</li>
              <li>✉️ contact@ma-boutique.ma</li>
              <li>🕒 Lun-Sam · 9h-19h</li>
            </ul>
          </div>
        </div>

        <div className="pied-bas">
          <p>
            © {new Date().getFullYear()} Ma Boutique React — Tous droits réservés
          </p>
          <p className="pied-paiement">Paiement à la livraison · Prix en dirhams</p>
        </div>
      </footer>

      <Panier
        ouvert={panierOuvert}
        onFermer={() => setPanierOuvert(false)}
        lignes={panier.lignes}
        nombreArticles={panier.nombreArticles}
        sousTotal={panier.sousTotal}
        frais={panier.frais}
        total={panier.total}
        restePourLivraisonGratuite={panier.restePourLivraisonGratuite}
        changerQuantite={panier.changerQuantite}
        retirer={panier.retirer}
        vider={panier.vider}
        onCommander={ouvrirCommande}
      />

      <FicheProduit
        produit={produitSelectionne}
        ouvert={Boolean(produitSelectionne)}
        onFermer={() => setProduitSelectionne(null)}
        onAjouter={ajouterAuPanier}
        favori={
          produitSelectionne ? favoris.favoris.includes(produitSelectionne.id) : false
        }
        onBasculerFavori={basculerFavori}
        similaires={
          produitSelectionne
            ? produits
                .filter(
                  (p) =>
                    p.categorie === produitSelectionne.categorie &&
                    p.id !== produitSelectionne.id
                )
                .slice(0, 3)
            : []
        }
        onChoisir={setProduitSelectionne}
      />

      <Commande
        ouvert={commandeOuverte}
        onFermer={() => setCommandeOuverte(false)}
        lignes={panier.lignes}
        total={panier.total}
        nombreArticles={panier.nombreArticles}
        onValider={validerCommande}
      />

      {message && (
        <div className="toast" role="status">
          <span>{message.texte}</span>
          {message.action === "panier" && (
            <button
              type="button"
              className="toast-action"
              onClick={() => {
                setMessage(null);
                setPanierOuvert(true);
              }}
            >
              Voir le panier
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
