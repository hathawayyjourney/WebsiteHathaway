import { MapPin, Calendar, Briefcase, Search, ChevronDown } from 'lucide-react';

export default function SearchPackage() {
  return (
    <div className="relative z-20 container mx-auto px-4 lg:px-8 max-w-[1250px] -mt-16 lg:-mt-24">
      <div className="bg-white rounded-[20px] shadow-xl p-4 lg:p-6 flex flex-col lg:flex-row items-center gap-4 border border-gray-100">
        
        {/* Destinasi */}
        <div className="flex-1 w-full lg:w-auto flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="w-10 h-10 bg-brand-softblue text-brand-navy rounded-full flex items-center justify-center shrink-0">
            <MapPin size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-brand-muted font-medium mb-0.5">Destinasi</p>
            <p className="text-sm font-semibold text-brand-dark">Pilih Destinasi</p>
          </div>
          <ChevronDown size={16} className="text-brand-muted" />
        </div>

        {/* Tanggal */}
        <div className="flex-1 w-full lg:w-auto flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="w-10 h-10 bg-brand-softblue text-brand-navy rounded-full flex items-center justify-center shrink-0">
            <Calendar size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-brand-muted font-medium mb-0.5">Tanggal</p>
            <p className="text-sm font-semibold text-brand-dark">Pilih Tanggal</p>
          </div>
          <ChevronDown size={16} className="text-brand-muted" />
        </div>

        {/* Jenis Trip */}
        <div className="flex-1 w-full lg:w-auto flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition">
          <div className="w-10 h-10 bg-brand-softblue text-brand-navy rounded-full flex items-center justify-center shrink-0">
            <Briefcase size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-brand-muted font-medium mb-0.5">Jenis Trip</p>
            <p className="text-sm font-semibold text-brand-dark">Semua Jenis</p>
          </div>
          <ChevronDown size={16} className="text-brand-muted" />
        </div>

        {/* Search Button */}
        <div className="w-full lg:w-auto pl-0 lg:pl-4">
          <button className="w-full lg:w-auto bg-brand-navy hover:bg-brand-navy-sec text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md">
            <Search size={18} />
            Cari Paket
          </button>
        </div>

      </div>
    </div>
  );
}
