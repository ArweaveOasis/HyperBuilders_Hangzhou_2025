import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Search, Menu, User } from 'lucide-react';
import { Page } from '../App';

interface Brand {
  id: string;
  name: string;
  description: string;
  image: string;
  era: string;
}

interface HeritagePageProps {
  onNavigate: (page: Page, brandId?: string) => void;
  brands: Brand[];
}

export const HeritagePage: React.FC<HeritagePageProps> = ({ onNavigate, brands }) => {
  const highlightedExperiences = [
    {
      title: 'Fashion Experiments',
      subtitle: 'Try out experiments created by artists and creative coders',
      image: 'https://images.unsplash.com/photo-1580698864216-8008843ce6b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWwlMjBlbGVnYW50fGVufDF8fHx8MTc1NzM5NTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Archive Explorer',
      subtitle: 'Explore high-definition fashion archives',
      image: 'https://images.unsplash.com/photo-1703449637424-cbefa705f4e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZmFzaGlvbiUyMGFyY2hpdmV8ZW58MXx8fHwxNzU3Mzk1NDc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-teal-500 to-cyan-600'
    },
    {
      title: 'Couture Stories',
      subtitle: 'Experience fashion culture in immersive narratives',
      image: 'https://images.unsplash.com/photo-1743708825952-eb9211e1765c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3V0dXJlJTIwZmFzaGlvbiUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzU3Mzk1NDgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      color: 'from-purple-600 to-pink-600'
    }
  ];

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
                onClick={() => onNavigate('home')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Menu className="w-5 h-5" />
                <span className="text-xl">Fashion Arts & Culture</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
              <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Explore</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Play</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Nearby</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Favorites</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Highlights Section */}
        <section className="mb-12">
          <h2 className="text-2xl mb-6">Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlightedExperiences.map((experience, index) => (
              <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <div className={`h-48 bg-gradient-to-br ${experience.color} relative overflow-hidden`}>
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-xl mb-2">{experience.title}</h3>
                    <p className="text-sm opacity-90">{experience.subtitle}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-2xl mb-6">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Card
                key={brand.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => onNavigate('archive', brand.id)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg mb-1">{brand.name}</h3>
                    <p className="text-sm opacity-80">{brand.description}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                        {brand.era} Era
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};