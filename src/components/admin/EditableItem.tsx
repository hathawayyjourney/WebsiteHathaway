/** Collapsible row used by the inline-editing admin lists (gallery, FAQ, testimoni, ...). */
export default function EditableItem({
  title,
  subtitle,
  badge,
  thumb,
  open,
  actions,
  children,
}: {
  title: string;
  subtitle?: string | null;
  badge?: React.ReactNode;
  thumb?: string | null;
  open?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <details open={open} className="group bg-white rounded-2xl border border-gray-100 shadow-sm">
      <summary className="list-none cursor-pointer flex items-center gap-4 p-4">
        {thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="w-14 h-10 rounded-lg object-cover shrink-0 bg-gray-100" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-brand-dark truncate">{title}</p>
          {subtitle && <p className="text-xs text-brand-muted truncate">{subtitle}</p>}
        </div>
        {badge}
        <span className="text-brand-muted text-xl leading-none group-open:rotate-45 transition">+</span>
      </summary>
      <div className="border-t border-gray-100 p-4 space-y-3">
        {children}
        {actions && <div className="text-right">{actions}</div>}
      </div>
    </details>
  );
}
