/** Etapy współpracy — używane na stronie głównej oraz na podstronie /wspolpraca. */
export const cooperationSteps = [
  {
    num: "01",
    title: "Formularz",
    description: "Wybierasz pakiet i wypełniasz podstawowe dane — otrzymujesz numer zgłoszenia i hasło e-mailem.",
    icon: "/images/ic1.png",
  },
  {
    num: "02",
    title: "Akceptacja",
    description: "Czekając na akceptację zlecenia możesz również przesłać dodatkowe informacje w panelu statusu.",
    icon: "/images/ic2.png",
  },
  {
    num: "03",
    title: "Projekt",
    description: "Przygotowujemy wizytówkę, treści i sekcje na podstawie informacji z formularza.",
    icon: "/images/ic3.png",
  },
  {
    num: "04",
    title: "Publikacja",
    description: "Po akceptacji strona trafia pod docelowy adres — gotowa dla gości.",
    icon: "/images/ic4.png",
  },
] as const;
