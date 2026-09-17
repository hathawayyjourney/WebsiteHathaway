import Header from '@/src/components/layout/Header';
import Footer from '@/src/components/layout/Footer';
import WhatsAppFloating from '@/src/components/ui/WhatsAppFloating';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function KontakPage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen pt-20 pb-20 bg-brand-light">
        <div className="bg-brand-navy py-16 lg:py-20 relative overflow-hidden mb-10">
          <div className="container mx-auto px-4 lg:px-8 max-w-[1250px] relative z-10 text-center">
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">KONTAK KAMI</h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Hubungi tim Hathaway Journey untuk konsultasi perjalanan Anda.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
          <Breadcrumb items={[{ label: 'Kontak' }]} />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100 h-full">
                <h2 className="text-xl font-bold text-brand-navy mb-8">Informasi Kontak</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-softblue text-brand-navy flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-dark mb-1">Alamat Kantor</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Jl. Travel Agent No. 123, <br/>
                        Jakarta Selatan, 12345, <br/>
                        DKI Jakarta, Indonesia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-softblue text-brand-navy flex items-center justify-center shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-dark mb-1">Telepon & WhatsApp</h4>
                      <p className="text-sm text-gray-600">+62 800 0000 000</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-softblue text-brand-navy flex items-center justify-center shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-dark mb-1">Email</h4>
                      <p className="text-sm text-gray-600">hello@hathawayjourney.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-softblue text-brand-navy flex items-center justify-center shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-brand-dark mb-1">Jam Operasional</h4>
                      <p className="text-sm text-gray-600">
                        Senin - Jumat: 09.00 - 17.00 <br/>
                        Sabtu: 09.00 - 14.00 <br/>
                        Minggu: Libur
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white p-8 lg:p-10 rounded-[20px] shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-brand-navy mb-8">Kirim Pesan</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                      <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition" placeholder="Masukkan nama Anda" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
                      <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition" placeholder="Contoh: 08123456789" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition" placeholder="Masukkan alamat email" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subjek</label>
                      <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition" placeholder="Subjek pesan" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pesan</label>
                    <textarea rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy transition resize-none" placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."></textarea>
                  </div>

                  <button type="button" className="bg-brand-navy hover:bg-brand-navy-sec text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-md w-full sm:w-auto">
                    <Send size={18} />
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Google Maps Placeholder */}
          <div className="mt-12 w-full h-[400px] bg-gray-200 rounded-[20px] overflow-hidden border border-gray-200 flex items-center justify-center">
            <span className="text-gray-500 font-semibold">Google Maps Embed Placeholder</span>
          </div>

        </div>
      </main>

      <Footer />
      <WhatsAppFloating />
    </>
  );
}
