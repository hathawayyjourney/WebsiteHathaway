import { ChevronDown, Search } from 'lucide-react';

export default function FilterPanel() {
  const filterSections = [
    {
      title: 'Destinasi',
      options: ['Indonesia', 'Asia', 'Eropa', 'Timur Tengah', 'Afrika', 'Amerika']
    },
    {
      title: 'Negara',
      options: ['Malaysia', 'Singapore', 'Thailand', 'Jepang', 'Korea Selatan', 'Turki']
    },
    {
      title: 'Jenis Trip',
      options: ['Open Trip', 'Private Trip', 'Corporate Gathering', 'Honeymoon']
    },
    {
      title: 'Durasi',
      options: ['1 - 3 Hari', '4 - 6 Hari', '7 - 10 Hari', '> 10 Hari']
    }
  ];

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-brand-navy text-lg mb-6 flex items-center justify-between">
        Filter Pencarian
        <span className="text-xs font-medium text-brand-red cursor-pointer hover:underline">Reset</span>
      </h3>

      {/* Search Input in Filter */}
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Cari nama paket..." 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition"
        />
        <Search size={16} className="absolute left-4 top-3.5 text-gray-400" />
      </div>

      <div className="space-y-6">
        {filterSections.map((section, idx) => (
          <div key={idx} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <h4 className="font-semibold text-brand-dark mb-4 flex items-center justify-between cursor-pointer">
              {section.title}
              <ChevronDown size={16} className="text-gray-400" />
            </h4>
            <div className="space-y-3">
              {section.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 rounded border border-gray-300 group-hover:border-brand-navy transition">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-full h-full rounded bg-brand-navy scale-0 peer-checked:scale-100 transition flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-brand-navy transition">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Harga */}
        <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
          <h4 className="font-semibold text-brand-dark mb-4 flex items-center justify-between cursor-pointer">
            Harga
            <ChevronDown size={16} className="text-gray-400" />
          </h4>
          <div className="space-y-3">
            <input type="range" className="w-full accent-brand-navy" min="0" max="50000000" />
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
              <span>Rp 0</span>
              <span>Rp 50.000.000+</span>
            </div>
          </div>
        </div>

        {/* Tanggal Keberangkatan */}
        <div className="pb-2">
          <h4 className="font-semibold text-brand-dark mb-4 flex items-center justify-between cursor-pointer">
            Tanggal Keberangkatan
            <ChevronDown size={16} className="text-gray-400" />
          </h4>
          <input 
            type="date" 
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-navy transition text-gray-600"
          />
        </div>

      </div>
    </div>
  );
}
