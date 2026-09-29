// Same navy hero band used on /paket-tour, /gallery, /kontak, /tentang-kami.
export default function PageHero({ title, subtitle, image }: { title: string; subtitle?: string; image?: string | null }) {
  return (
    <div className="bg-brand-navy py-16 lg:py-20 relative overflow-hidden mb-10">
      {image && (
        <div
          className="absolute inset-0 z-0 opacity-20 mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
        ></div>
      )}
      <div className="container mx-auto px-4 lg:px-8 max-w-[1250px] relative z-10 text-center">
        <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight whitespace-pre-line">{title}</h1>
        {subtitle && <p className="text-white/80 max-w-xl mx-auto">{subtitle}</p>}
      </div>
    </div>
  );
}
