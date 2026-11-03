// Petits utilitaires partagés par les composants.

const formateurNombre = new Intl.NumberFormat("fr-FR");

/** Formate un prix : 1250 -> "1 250 DH" */
export function formaterPrix(valeur) {
  return `${formateurNombre.format(valeur)} DH`;
}

/** 0.25 -> "25 %" (avec espace insécable avant le %) */
export function formaterPourcentage(valeur) {
  return `${Math.round(valeur * 100)}\u00a0%`;
}

/** Calcule la remise en pourcentage entre l'ancien prix et le prix actuel. */
export function calculerRemise(prix, ancienPrix) {
  if (!ancienPrix || ancienPrix <= prix) return 0;
  return Math.round((1 - prix / ancienPrix) * 100);
}

/** Génère un numéro de commande lisible : CMD-8F3K2A */
export function genererNumeroCommande() {
  const aleatoire = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CMD-${aleatoire}`;
}

/** Nettoie un numéro de téléphone (espaces, points, tirets). */
export function nettoyerTelephone(telephone) {
  return telephone.replace(/[\s.-]/g, "");
}

/** Validation d'un numéro marocain : 0612345678 ou +212612345678 */
export function telephoneValide(telephone) {
  return /^(?:\+212|0)[5-7]\d{8}$/.test(nettoyerTelephone(telephone));
}
