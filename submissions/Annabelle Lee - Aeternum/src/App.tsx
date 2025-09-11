import React, { useState, useEffect } from 'react';
import { NewHomePage } from './components/NewHomePage';
import { NewHeritagePage } from './components/NewHeritagePage';
import { NewArchivePage } from './components/NewArchivePage';
import { AdminPanel } from './components/AdminPanel';
import { Button } from './components/ui/button';
import { Settings } from 'lucide-react';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { ChatWidget } from './components/ChatWidget';
import { ChatbotWidget } from './components/ChatbotWidget';

// Mock data for demonstration
export const mockBrands = [
  {
    id: 'chanel',
    name: 'Chanel',
    description: 'Timeless elegance and revolutionary designs',
    image: 'https://images.unsplash.com/photo-1580698864216-8008843ce6b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWwlMjBlbGVnYW50fGVufDF8fHx8MTc1NzM5NTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    era: 'Modern'
  },
  {
    id: 'dior',
    name: 'Christian Dior', 
    description: 'The New Look that changed fashion forever',
    image: 'https://images.unsplash.com/photo-1718963581729-673ed905416a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduJTIwYXRlbGllcnxlbnwxfHx8fDE3NTczOTU0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    era: 'Classic'
  },
  {
    id: 'ysl',
    name: 'Yves Saint Laurent',
    description: 'Liberating women through revolutionary fashion',
    image: 'https://images.unsplash.com/photo-1703449637424-cbefa705f4e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZmFzaGlvbiUyMGFyY2hpdmV8ZW58MXx8fHwxNzU3Mzk1NDc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    era: 'Vintage'
  },
  {
    id: 'balenciaga',
    name: 'Balenciaga',
    description: 'Master of architectural fashion',
    image: 'https://images.unsplash.com/photo-1743708825952-eb9211e1765c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3V0dXJlJTIwZmFzaGlvbiUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU3Mzk1NDgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    era: 'Contemporary'
  }
];

export const mockArchiveItems = [
  {
    id: 1,
    title: 'The Little Black Dress',
    brand: 'Chanel',
    year: '1926',
    description: 'Coco Chanel\'s revolutionary design that became a timeless wardrobe staple',
    image: 'https://images.unsplash.com/photo-1580698864216-8008843ce6b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWwlMjBlbGVnYW50fGVufDF8fHx8MTc1NzM5NTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Dresses'
  },
  {
    id: 2,
    title: 'New Look Collection',
    brand: 'Christian Dior',
    year: '1947',
    description: 'The revolutionary silhouette that redefined post-war femininity',
    image: 'https://images.unsplash.com/photo-1718963581729-673ed905416a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduJTIwYXRlbGllcnxlbnwxfHx8fDE3NTczOTU0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Collections'
  },
  {
    id: 3,
    title: 'Le Smoking Tuxedo',
    brand: 'Yves Saint Laurent',
    year: '1966',
    description: 'The first tuxedo suit designed for women',
    image: 'https://images.unsplash.com/photo-1703449637424-cbefa705f4e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZmFzaGlvbiUyMGFyY2hpdmV8ZW58MXx8fHwxNzU3Mzk1NDc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Suits'
  },
  {
    id: 4,
    title: 'Balloon Jacket',
    brand: 'Balenciaga',
    year: '1953',
    description: 'Cristóbal Balenciaga\'s architectural masterpiece',
    image: 'https://images.unsplash.com/photo-1743708825952-eb9211e1765c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3V0dXJlJTIwZmFzaGlvbiUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU3Mzk1NDgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Outerwear'
  },
  {
    id: 5,
    title: 'Mondrian Collection',
    brand: 'Yves Saint Laurent',
    year: '1965',
    description: 'Art meets fashion in this iconic geometric collection',
    image: 'https://images.unsplash.com/photo-1706665714936-3211c96474c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBhcnQlMjBleGhpYml0aW9ufGVufDF8fHx8MTc1NzM5NTQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Collections'
  },
  {
    id: 6,
    title: 'Chanel Suit',
    brand: 'Chanel',
    year: '1954',
    description: 'The timeless suit that liberated women from corseted fashion',
    image: 'https://images.unsplash.com/photo-1580698864216-8008843ce6b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWwlMjBlbGVnYW50fGVufDF8fHx8MTc1NzM5NTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Suits'
  }
];

export type Page = 'home' | 'heritage' | 'archive' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brands, setBrands] = useState(mockBrands);
  const [archiveItems, setArchiveItems] = useState(mockArchiveItems);
  const [showAdmin, setShowAdmin] = useState(false);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      const [brandsRes, itemsRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8aa26b6f/brands`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8aa26b6f/archive-items`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        })
      ]);

      if (brandsRes.ok) {
        const brandsData = await brandsRes.json();
        if (brandsData.brands && brandsData.brands.length > 0) {
          setBrands(brandsData.brands);
        }
      }

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        if (itemsData.items && itemsData.items.length > 0) {
          setArchiveItems(itemsData.items);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Keep using mock data if backend fails
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigateToPage = (page: Page, brandId?: string) => {
    setCurrentPage(page);
    if (brandId) {
      setSelectedBrand(brandId);
    }
  };

  const renderCurrentPage = () => {
    if (showAdmin) {
      return <AdminPanel />;
    }

    switch (currentPage) {
      case 'home':
        return <NewHomePage onNavigate={navigateToPage} />;
      case 'heritage':
        return <NewHeritagePage onNavigate={navigateToPage} />;
      case 'archive':
        return <NewArchivePage onNavigate={navigateToPage} selectedBrand={selectedBrand} />;
      default:
        return <NewHomePage onNavigate={navigateToPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Toggle Button */}
      {/* {!showAdmin && (
        <Button
          className="fixed top-4 right-4 z-50 bg-black text-white hover:bg-gray-800"
          size="sm"
          onClick={() => setShowAdmin(true)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Admin
        </Button>
      )} */}
      
      {showAdmin && (
        <Button
          className="fixed top-4 right-4 z-50"
          variant="outline"
          size="sm"
          onClick={() => setShowAdmin(false)}
        >
          Exit Admin
        </Button>
      )}

  {renderCurrentPage()}
  <ChatWidget />
  <ChatbotWidget />
    </div>
  );
}