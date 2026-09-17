import Header from '@/src/components/layout/Header';
import Footer from '@/src/components/layout/Footer';
import WhatsAppFloating from '@/src/components/ui/WhatsAppFloating';
import Breadcrumb from '@/src/components/ui/Breadcrumb';
import FinalCTA from '@/src/components/home/FinalCTA';
import Image from 'next/image';

export default function TentangKamiPage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen pt-20 pb-0 bg-brand-light">
        {/* Page Hero Area */}
        <div className="bg-brand-navy py-16 lg:py-20 relative overflow-hidden mb-10">
          <div className="container mx-auto px-4 lg:px-8 max-w-[1250px] relative z-10 text-center">
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight">TENTANG KAMI</h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Mengenal lebih dekat Hathaway Journey, partner perjalanan terpercaya Anda.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 max-w-[1250px]">
          <Breadcrumb items={[{ label: 'Tentang Kami' }]} />

          {/* Section: Tentang & Sejarah */}
          <div className="flex flex-col md:flex-row gap-12 items-center mb-20 bg-white p-8 lg:p-12 rounded-[20px] shadow-sm">
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl lg:text-3xl font-black text-brand-navy mb-6">TENTANG HATHAWAY JOURNEY</h2>
              <div className="w-12 h-1 bg-brand-red mb-6"></div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Hathaway Journey adalah perusahaan travel management terkemuka yang berdedikasi untuk memberikan pengalaman perjalanan tak terlupakan. Didirikan dengan passion terhadap dunia pariwisata, kami mengerti bahwa setiap perjalanan adalah sebuah cerita.
              </p>
              <h3 className="font-bold text-lg text-brand-dark mt-8 mb-4">Sejarah Perusahaan</h3>
              <p className="text-gray-600 leading-relaxed">
                Dimulai pada tahun 2018, kami berawal dari penyedia private tour kecil. Berkat kepercayaan pelanggan yang terus bertumbuh, Hathaway Journey kini telah menangani ribuan traveler setiap tahunnya, baik untuk kebutuhan personal, grup, maupun korporasi, menjangkau lebih dari 50+ destinasi global.
              </p>
            </div>
            <div className="w-full md:w-1/2 relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" alt="Tim Hathaway Journey" fill className="object-cover" />
            </div>
          </div>

          {/* Section: Visi, Misi, Nilai */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-brand-navy text-white p-8 rounded-[20px] shadow-lg">
              <h3 className="text-xl font-bold mb-4">Visi</h3>
              <p className="text-white/80 leading-relaxed">
                Menjadi partner perjalanan terdepan di Indonesia yang memberikan pelayanan kelas dunia dan menciptakan kenangan abadi bagi setiap pelanggan.
              </p>
            </div>
            <div className="bg-brand-red text-white p-8 rounded-[20px] shadow-lg">
              <h3 className="text-xl font-bold mb-4">Misi</h3>
              <ul className="list-disc list-outside ml-4 text-white/90 space-y-2">
                <li>Menyediakan paket tour berkualitas.</li>
                <li>Memberikan customer service 24/7.</li>
                <li>Membangun ekosistem pariwisata yang berkelanjutan.</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-brand-navy mb-4">Nilai Perusahaan</h3>
              <ul className="list-disc list-outside ml-4 text-gray-600 space-y-2">
                <li><strong className="text-brand-dark">Trust:</strong> Kepercayaan adalah kunci.</li>
                <li><strong className="text-brand-dark">Excellence:</strong> Layanan prima.</li>
                <li><strong className="text-brand-dark">Care:</strong> Peduli pada detail perjalanan.</li>
              </ul>
            </div>
          </div>

          {/* Section: Legalitas & Sertifikasi */}
          <div className="text-center mb-20">
            <h2 className="text-2xl font-black text-brand-navy mb-12">LEGALITAS & SERTIFIKASI</h2>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-48 font-bold text-gray-400">ASITA Member</div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-48 font-bold text-gray-400">IATA Certified</div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-48 font-bold text-gray-400">Kemenpar Registered</div>
            </div>
          </div>
        </div>

        <FinalCTA />
      </main>

      <Footer />
      <WhatsAppFloating />
    </>
  );
}
