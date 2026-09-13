import { Phone } from 'lucide-react';

export default function WhatsAppFloating() {
  return (
    <a
      href="https://wa.me/628000000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 bg-brand-wa text-white w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
      title="Konsultasi via WhatsApp"
    >
      <Phone size={28} fill="currentColor" />
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Konsultasi via WhatsApp
        {/* Triangle arrow */}
        <span className="absolute top-1/2 -mt-1 -right-1 w-2 h-2 bg-gray-900 rotate-45"></span>
      </span>
    </a>
  );
}
