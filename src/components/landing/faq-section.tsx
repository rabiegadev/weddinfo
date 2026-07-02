import { LandingSectionInner } from "./landing-section-inner";

const faqItems = [
  {
    q: "Czy muszę dostarczyć teksty do wyświetlenia na stronie?",
    a: "Nie — na podstawie dostarczonych informacji przygotujemy wstępny koncept wraz z tekstami do akceptacji lub modyfikacji.",
  },
  {
    q: "Czy goście muszą coś instalować?",
    a: "Nie. Wizytówka to zwykła strona w przeglądarce — jeden link z zaproszenia lub wiadomości.",
  },
  {
    q: "Jak wygląda potwierdzenie obecności?",
    a: "Gość wypełnia krótki formularz na stronie; odpowiedzi trafiają do panelu pary. To funkcja opcjonalna — włączamy ją według briefu.",
  },
  {
    q: "Czy mogę wybrać nazwę domeny?",
    a: "Tak — możesz. Wybór zależy od dostępności nazwy; ustalamy go podczas wstępnych rozmów i zbierania informacji.",
  },
  {
    q: "Jak wygląda galeria zdjęć?",
    a: "Zależy od ustaleń oraz rozmiaru (wagi) przesyłanych plików — dopasowujemy rozwiązanie do Waszych potrzeb.",
  },
  {
    q: "Co jeśli po wesele chcę usunąć stronę?",
    a: "Okres, w którym strona będzie dostępna, ustalamy indywidualnie. Standardowo publikujemy ją na kilka miesięcy przed uroczystością — w zależności od ustaleń możemy ten czas dostosować.",
  },
  {
    q: "Czy strona dostępna po weselu pojawia się automatycznie następnego dnia?",
    a: "Tak — możemy skonfigurować stronę tak, aby następnego dnia automatycznie wyświetlała podziękowania oraz przekierowanie do galerii zdjęć od uczestników wesela.",
  },
  {
    q: "Czy oferujecie kody QR?",
    a: "Tak — oferujemy personalizowane kody QR, które możemy dostarczyć w różnych rozmiarach, np. do dołączenia do zaproszeń lub wysłania w formie SMS.",
  },
] as const;

function FaqColumn({ items }: { items: readonly (typeof faqItems)[number][] }) {
  return (
    <div className="divide-y divide-[var(--border-light)]">
      {items.map((item) => (
        <details key={item.q} className="faq-item group">
          <summary className="flex items-center justify-between gap-4 py-5 text-left font-medium text-[var(--text-dark)]">
            <span>{item.q}</span>
            <span className="relative flex size-5 shrink-0 items-center justify-center text-[var(--gold)]" aria-hidden>
              <span className="absolute h-px w-3 bg-current" />
              <span className="faq-plus-vertical absolute h-3 w-px bg-current transition-transform duration-200" />
            </span>
          </summary>
          <p className="pb-5 text-left text-sm leading-relaxed text-[var(--text-muted)]">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqSection() {
  const mid = Math.ceil(faqItems.length / 2);

  return (
    <section
      id="faq"
      className="scroll-mt-header bg-white py-16 sm:py-24"
      aria-labelledby="faq-heading"
    >
      <LandingSectionInner>
        <h2
          id="faq-heading"
          className="font-wedinfo-serif mx-auto max-w-3xl text-center text-3xl font-medium text-[var(--text-dark)] sm:text-4xl"
        >
          FAQ — najczęściej zadawane pytania
        </h2>

        <div className="mx-auto mt-12 max-w-5xl border-y border-[var(--border-light)] md:grid md:grid-cols-2 md:gap-x-14">
          <FaqColumn items={faqItems.slice(0, mid)} />
          <FaqColumn items={faqItems.slice(mid)} />
        </div>
      </LandingSectionInner>
    </section>
  );
}
