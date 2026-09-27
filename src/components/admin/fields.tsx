import { FieldError } from './AdminForm';

export const inputClass =
  'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition';

type Base = { name: string; label: string; hint?: string; className?: string };

export function Field({ name, label, hint, className, children }: Base & { children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-brand-muted mt-1">{hint}</p>}
      <FieldError name={name} />
    </div>
  );
}

export function TextField({
  type = 'text',
  defaultValue,
  placeholder,
  required,
  ...base
}: Base & { type?: string; defaultValue?: string | number | null; placeholder?: string; required?: boolean }) {
  return (
    <Field {...base}>
      <input
        id={base.name}
        name={base.name}
        type={type}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </Field>
  );
}

export function TextArea({ defaultValue, rows = 4, placeholder, ...base }: Base & { defaultValue?: string | null; rows?: number; placeholder?: string }) {
  return (
    <Field {...base}>
      <textarea id={base.name} name={base.name} rows={rows} defaultValue={defaultValue ?? ''} placeholder={placeholder} className={inputClass} />
    </Field>
  );
}

export function SelectField({
  options,
  defaultValue,
  emptyLabel,
  ...base
}: Base & { options: { value: string | number; label: string }[]; defaultValue?: string | number | null; emptyLabel?: string }) {
  return (
    <Field {...base}>
      <select id={base.name} name={base.name} defaultValue={defaultValue ?? ''} className={inputClass}>
        {emptyLabel !== undefined && <option value="">{emptyLabel}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="w-4 h-4 accent-brand-navy" />
      {label}
    </label>
  );
}

export function Panel({ title, children, actions }: { title?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
      {(title || actions) && (
        <div className="flex items-center justify-between gap-4 mb-5">
          {title && <h2 className="text-lg font-bold text-brand-navy">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
