export type PackageBadge = 'HOT DEAL' | 'BEST SELLER' | 'POPULAR' | 'FAVORITE';

export interface PackageData {
  id: string;
  name: string;
  destination: string;
  duration: string;
  countries: string;
  departure: string;
  price: string;
  image: string;
  badge?: PackageBadge;
  badgeColor?: string;
  rating?: number;
}
