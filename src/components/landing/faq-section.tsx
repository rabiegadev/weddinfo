import { LandingSectionInner } from "./landing-section-inner";

const faqItems = [
  {
    q: "Czy muszę mieć już zebrane wszystkie teksty?",
    a: "Nie — wystarczy brief. Treści możemy uzupełniać iteracyjnie; im wcześniej masz datę i lokalizację, tym spokojniejszy harmonogram prac.",
  },
  {
    q: "Czy goście muszą coś instalować?",
    a: "Nie. Wizytówka to zwykła strona w przeglądarce — jeden link z zaproszenia lub wiadomości.",
  },
  {
    q: "Jak wygląda RSVP?",
    a: "Gość wypełnia krótki formularz na stronie; odpowiedzi trafiają do panelu zapytania pary. Możemy włączyć lub wyłączyć RSVP wg briefu.",
  },
  {
    q: "Czy mogę mieć własną domenę?",
    a: "Tak w wyższych pakietach — wymaga konfiguracji DNS u Twojego rejestratora. Pomagamy instrukcją krok po kroku.",
  },
  {
    q: "Co jeśli po wesele chcę usunąć stronę?",
    a: "Możemy ustawić tryb archiwum lub wyłączyć publikację — ustalamy to przy kontrakcie lub mailu końcowym.",
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
