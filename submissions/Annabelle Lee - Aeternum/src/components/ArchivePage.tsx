import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Search, Menu } from 'lucide-react';
import { Page } from '../App';

interface ArchiveItem {
  id: number;
  title: string;
  brand: string;
  year: string;
  description: string;
  image: string;
  category: string;
}

interface ArchivePageProps {
  onNavigate: (page: Page) => void;
  selectedBrand: string | null;
  archiveItems: ArchiveItem[];
}

export const ArchivePage: React.FC<ArchivePageProps> = ({ 
  onNavigate, 
  selectedBrand, 
  archiveItems 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', 'Dresses', 'Suits', 'Collections', 'Outerwear'];
  
  const filteredItems = useMemo(() => {
    let filtered = archiveItems;
    
    if (selectedBrand) {
      filtered = filtered.filter(item => 
        item.brand.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }
    
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    return filtered;
  }, [archiveItems, selectedBrand, selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('heritage')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl tracking-tight">MoFA</h1>
                <span className="text-sm text-gray-500">Museum of Fashion Archives</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Button variant="ghost" className="hidden md:inline-flex">
                Membership
              </Button>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2">
                Tickets
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-12">
            <a href="#" className="text-gray-700 hover:text-gray-900">Visit</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Exhibitions and events</a>
            <a href="#" className="text-black border-b-2 border-black pb-3">Art and artists</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Store</a>
            <Button variant="ghost" size="sm" className="ml-auto">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-black text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
          {selectedBrand && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Showing archives for: <span className="font-medium">{selectedBrand}</span>
              </p>
            </div>
          )}
        </div>

        {/* Archive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-base mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{item.brand}</p>
                <p className="text-sm text-gray-600 mb-2">{item.year}</p>
                <p className="text-xs text-gray-500 line-clamp-3">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No archive items found for the selected filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};