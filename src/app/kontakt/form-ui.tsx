export const inputClass =
  "w-full border border-[var(--border-light)] bg-white px-4 py-3 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold)] focus:outline-none";

export const textareaClass = `${inputClass} resize-y min-h-[120px]`;

export const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-dark)]";

export const hintClass = "mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]";

export const sectionTitleClass =
  "font-wedinfo-serif text-xl font-medium text-[var(--text-dark)] sm:text-2xl";

export const sectionSubtitleClass = "mt-2 text-sm leading-relaxed text-[var(--text-muted)]";

export function FormSectionDivider({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative border-t border-[var(--border-light)] pt-10">
      <span
        className="absolute -top-3 left-0 bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]"
        aria-hidden
      >
        ◆
      </span>
      <h3 className={sectionTitleClass}>{title}</h3>
      {subtitle ? <p className={sectionSubtitleClass}>{subtitle}</p> : null}
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-sm text-red-700" role="alert">
      {message}
    </p>
  );
}

export function HoneypotField() {
  return (
    <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
      <label htmlFor="inquiry-website">Nie wypełniaj</label>
      <input id="inquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function YesNoField({
  name,
  label,
  notesName,
  notesLabel,
  defaultChecked,
}: {
  name: string;
  label: string;
  notesName: string;
  notesLabel: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="rounded border border-[var(--border-light)] bg-[var(--bg-light)]/40 p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name={name}
          value="true"
          defaultChecked={defaultChecked}
          className="mt-1 size-4 accent-[var(--gold)]"
        />
        <span className="text-sm text-[var(--text-dark)]">{label}</span>
      </label>
      <div className="mt-3">
        <label htmlFor={notesName} className="mb-2 block text-xs text-[var(--text-muted)]">
          {notesLabel}
        </label>
        <textarea id={notesName} name={notesName} rows={2} className={textareaClass} />
      </div>
    </div>
  );
}

export function FileUploadField({
  name,
  label,
  hint,
  multiple = false,
}: {
  name: string;
  label: string;
  hint: string;
  multiple?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        className="block w-full text-sm text-[var(--text-muted)] file:mr-4 file:border-0 file:bg-[var(--bg-light)] file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-[var(--text-dark)]"
      />
      <p className={hintClass}>{hint}</p>
    </div>
  );
}
