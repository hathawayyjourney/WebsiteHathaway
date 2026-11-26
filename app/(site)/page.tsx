import HeroSection from '@/src/components/home/HeroSection';
import SearchPackage from '@/src/components/home/SearchPackage';
import TrustBenefits from '@/src/components/home/TrustBenefits';
import RecommendedPackages from '@/src/components/home/RecommendedPackages';
import PopularDestinations from '@/src/components/home/PopularDestinations';
import StatsSection from '@/src/components/home/StatsSection';
import FinalCTA from '@/src/components/home/FinalCTA';
import { getSettings } from '@/src/server/queries/settings';
import { getFeaturedPackages, getPackageFilterOptions } from '@/src/server/queries/packages';
import { waLink } from '@/src/lib/whatsapp';
import { getPopularDestinations } from '@/src/server/queries/destinations';
import { pageMetadata } from '@/src/lib/seo';
import type { Metadata } from 'next';

// Title and description come from the root layout defaults.
export const metadata: Metadata = pageMetadata({ path: '/' });

export default async function Home() {
  const [settings, featured, options, popular] = await Promise.all([
    getSettings('contact', 'wa_templates', 'home_stats', 'home_benefits'),
    getFeaturedPackages(4),
    getPackageFilterOptions(),
    getPopularDestinations(),
  ]);
  const whatsappHref = waLink(settings.contact.whatsapp, settings.wa_templates.general);

  return (
    <main className="min-h-screen">
      <HeroSection whatsappHref={whatsappHref} />
      <SearchPackage destinations={options.destinations} categories={options.categories} />
      <TrustBenefits items={settings.home_benefits} />
      <RecommendedPackages packages={featured} />
      <PopularDestinations destinations={popular} />
      <StatsSection items={settings.home_stats} />
      <FinalCTA whatsappHref={whatsappHref} />
    </main>
  );
}
