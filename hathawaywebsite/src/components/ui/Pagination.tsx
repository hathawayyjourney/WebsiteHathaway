import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination() {
  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 transition cursor-not-allowed" disabled>
        <ChevronLeft size={18} />
      </button>
      
      <button className="w-10 h-10 rounded-full flex items-center justify-center bg-brand-navy text-white font-semibold shadow-md">
        1
      </button>
      
      <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-brand-dark hover:border-brand-navy hover:text-brand-navy font-semibold transition">
        2
      </button>
      
      <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-brand-dark hover:border-brand-navy hover:text-brand-navy font-semibold transition">
        3
      </button>
      
      <span className="text-gray-400 px-1">...</span>
      
      <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-brand-dark hover:border-brand-navy hover:text-brand-navy font-semibold transition">
        12
      </button>
      
      <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-brand-navy hover:bg-gray-50 transition">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
