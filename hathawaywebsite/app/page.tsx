import Header from '@/src/components/layout/Header';
import Footer from '@/src/components/layout/Footer';
import HeroSection from '@/src/components/home/HeroSection';
import SearchPackage from '@/src/components/home/SearchPackage';
import TrustBenefits from '@/src/components/home/TrustBenefits';
import RecommendedPackages from '@/src/components/home/RecommendedPackages';
import PopularDestinations from '@/src/components/home/PopularDestinations';
import StatsSection from '@/src/components/home/StatsSection';
import FinalCTA from '@/src/components/home/FinalCTA';
import WhatsAppFloating from '@/src/components/ui/WhatsAppFloating';

export default function Home() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen">
        <HeroSection />
        <SearchPackage />
        <TrustBenefits />
        <RecommendedPackages />
        <PopularDestinations />
        <StatsSection />
        <FinalCTA />
      </main>

      <Footer />
      <WhatsAppFloating />
    </>
  );
}
