import {
  calculerRemise,
  formaterPrix,
  genererNumeroCommande,
  telephoneValide,
} from "./utils";

describe("utils", () => {
  test("formate les prix en dirhams", () => {
    expect(formaterPrix(150)).toBe("150 DH");
    expect(formaterPrix(1250)).toContain("DH");
  });

  test("calcule la remise sans dépasser les bornes", () => {
    expect(calculerRemise(150, 199)).toBe(25);
    expect(calculerRemise(100, null)).toBe(0);
    expect(calculerRemise(100, 80)).toBe(0);
  });

  test("valide les numéros marocains", () => {
    expect(telephoneValide("0612345678")).toBe(true);
    expect(telephoneValide("06 12 34 56 78")).toBe(true);
    expect(telephoneValide("+212612345678")).toBe(true);
    expect(telephoneValide("0123456789")).toBe(false);
    expect(telephoneValide("0612345")).toBe(false);
  });

  test("génère un numéro de commande lisible", () => {
    expect(genererNumeroCommande()).toMatch(/^CMD-[A-Z0-9]{6}$/);
  });
});
