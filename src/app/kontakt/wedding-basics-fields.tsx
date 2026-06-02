import { inputClass, labelClass, textareaClass } from "./form-ui";

export function WeddingBasicsFields() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="brideName" className={labelClass}>
            Imię i nazwisko panny młodej
          </label>
          <input id="brideName" name="brideName" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="groomName" className={labelClass}>
            Imię i nazwisko pana młodego
          </label>
          <input id="groomName" name="groomName" type="text" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="weddingDate" className={labelClass}>
          Data ślubu
        </label>
        <input id="weddingDate" name="weddingDate" type="date" required className={inputClass} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="ceremonyLocation" className={labelClass}>
            Miejsce ślubu
          </label>
          <input id="ceremonyLocation" name="ceremonyLocation" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="receptionLocation" className={labelClass}>
            Miejsce wesela
          </label>
          <input id="receptionLocation" name="receptionLocation" type="text" required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="scheduleNotes" className={labelClass}>
          Harmonogram godzinowy
        </label>
        <textarea
          id="scheduleNotes"
          name="scheduleNotes"
          rows={5}
          className={textareaClass}
          placeholder="Np. 14:00 ceremonia, 15:30 gratulacje, 16:00 transport do sali…"
        />
      </div>

      <div>
        <label htmlFor="lodgingInfo" className={labelClass}>
          Informacje o noclegach
        </label>
        <textarea id="lodgingInfo" name="lodgingInfo" rows={3} className={textareaClass} />
      </div>

      <div>
        <label htmlFor="afterpartyInfo" className={labelClass}>
          Poprawiny
        </label>
        <textarea id="afterpartyInfo" name="afterpartyInfo" rows={3} className={textareaClass} />
      </div>

      <div>
        <label htmlFor="guestInfo" className={labelClass}>
          Informacje dla gości do przekazania
        </label>
        <textarea
          id="guestInfo"
          name="guestInfo"
          rows={4}
          className={textareaClass}
          placeholder="Dress code, parking, prezenty, kontakt do świadków…"
        />
      </div>

      <p className="text-xs leading-relaxed text-[var(--text-muted)]">
        Reszta szczegółów zostanie ustalona w rozmowie — im więcej podasz teraz, tym trafniejsza wycena.
      </p>
    </div>
  );
}
