import { useEffect } from "react";

/**
 * Fenêtre modale accessible : fermeture par Échap / clic sur le voile,
 * blocage du scroll de la page en arrière-plan.
 * variante : "droite" (tiroir latéral) ou "centre" (boîte centrée).
 */
function Modal({ ouvert, onFermer, variante = "centre", classe = "", etiquette, children }) {
  useEffect(() => {
    if (!ouvert) return undefined;

    function surTouche(e) {
      if (e.key === "Escape") onFermer();
    }

    const overflowInitial = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", surTouche);

    return () => {
      window.removeEventListener("keydown", surTouche);
      document.body.style.overflow = overflowInitial;
    };
  }, [ouvert, onFermer]);

  if (!ouvert) return null;

  return (
    <div className={`voile ${variante}`} onClick={onFermer} role="presentation">
      <div
        className={`modale ${classe}`}
        role="dialog"
        aria-modal="true"
        aria-label={etiquette}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
