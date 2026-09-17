import { PackageData } from '../types';

export const recommendedPackages: PackageData[] = [
  {
    id: 'p1',
    name: 'Malaysia Singapore\nThailand (Hatyai)',
    destination: 'Malaysia, Singapore, Thailand',
    duration: '5D',
    countries: '3 Negara',
    departure: 'Setiap Rabu',
    price: '6.990.000',
    image: 'https://images.unsplash.com/photo-1596422846543-74c6fc0e2811?q=80&w=600&auto=format&fit=crop', // Singapore Marina Bay Sands
    badge: 'HOT DEAL',
    badgeColor: 'bg-red-500'
  },
  {
    id: 'p2',
    name: 'Malaysia Singapore\nThailand (Bangkok Pattaya)',
    destination: 'Malaysia, Singapore, Thailand',
    duration: '6D',
    countries: '3 Negara',
    departure: 'Setiap Rabu',
    price: '8.990.000',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=600&auto=format&fit=crop', // Thailand Grand Palace
    badge: 'BEST SELLER',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 'p3',
    name: 'Malaysia Singapore\n',
    destination: 'Malaysia, Singapore',
    duration: '4D',
    countries: '2 Negara',
    departure: 'Setiap Rabu',
    price: '5.990.000',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?q=80&w=600&auto=format&fit=crop', // Merlion
    badge: 'POPULAR',
    badgeColor: 'bg-green-500'
  },
  {
    id: 'p4',
    name: 'Malaysia Singapore\n',
    destination: 'Malaysia, Singapore',
    duration: '5D',
    countries: '2 Negara',
    departure: 'Setiap Rabu',
    price: '7.990.000',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=600&auto=format&fit=crop', // Singapore skyline
    badge: 'FAVORITE',
    badgeColor: 'bg-blue-500' // Visual reference has blue/navy or yellow
  }
];

export const popularDestinations = [
  { id: 'd1', name: 'INDONESIA', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=600&auto=format&fit=crop' }, // Bali
  { id: 'd2', name: 'ASIA', image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=600&auto=format&fit=crop' }, // Japan
  { id: 'd3', name: 'EROPA', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=600&auto=format&fit=crop' }, // Paris
  { id: 'd4', name: 'TIMUR TENGAH', image: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?q=80&w=600&auto=format&fit=crop' }, // Turkey/Dubai
  { id: 'd5', name: 'DESTINASI LAINNYA', image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=600&auto=format&fit=crop' } // Beach
];
