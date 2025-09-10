import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { Page } from '../App';

interface NewHeritagePageProps {
  onNavigate: (page: Page, brandId?: string) => void;
}

// Editable content structure for backend integration
const pageContent = {
  artCulture: {
    title: "Art & Culture",
    exhibitions: {
      title: "Exhibitions",
      subtitle: "In-house exhibition coming up on Sep 20, 2025",
      backgroundColor: "#F4E97A"
    },
    events: {
      title: "Events", 
      subtitle: "SS 2026 Haute Couture in Paris",
      backgroundColor: "#F4E97A"
    },
    nfts: {
      title: "NFTs",
      subtitle: "Holder will participate in House Events",
      backgroundColor: "#F4E97A"
    }
  },
  fashionHouses: {
    title: "Fashion Houses",
    brands: [
      {
        id: "dior",
        name: "Dior",
        subtitle: "A legacy of elegance and innovation",
        backgroundColor: "#F4E97A"
      },
      {
        id: "chanel", 
        name: "Chanel",
        subtitle: "From the little black dress to timeless tweed",
        backgroundColor: "#F4E97A"
      },
      {
        id: "hermes",
        name: "Hermès", 
        subtitle: "Renowned for craftsmanship and heritage",
        backgroundColor: "#F4E97A"
      },
      {
        id: "balenciaga",
        name: "Balenciaga",
        subtitle: "Cristóbal Balenciaga's bold silhouettes and today's avant-garde edge",
        backgroundColor: "#F4E97A"
      }
    ]
  }
};

export const NewHeritagePage: React.FC<NewHeritagePageProps> = ({ onNavigate }) => {
  const handleCardClick = (cardType: string, brandId?: string) => {
    // Track analytics
    console.log(`Card clicked: ${cardType}${brandId ? ` - ${brandId}` : ''}`);
    
    // All cards redirect to archive page
    if (brandId) {
      // Brand cards redirect to specific brand archive
      onNavigate('archive', brandId);
    } else {
      // Art & Culture cards redirect to general archive
      onNavigate('archive');
    }
    
    // TODO: Add your custom redirect logic here
    // Example: window.location.href = `/archive/${brandId || cardType}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" style={{ fontFamily: 'Chalix, sans-serif' }}>
      {/* Header with Return Link */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="text-gray-600 hover:text-gray-800 font-medium"
            style={{ fontFamily: 'Chalix, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Art & Culture Section */}
        <section className="mb-12">
          <h2 className="text-4xl text-gray-600 mb-8" style={{ fontFamily: 'Chalix, sans-serif' }}>
            {pageContent.artCulture.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Exhibitions Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md"
              onClick={() => handleCardClick('exhibitions')}
            >
              <CardContent 
                className="p-8 h-48 flex flex-col justify-end relative rounded-xl"
                style={{ backgroundColor: pageContent.artCulture.exhibitions.backgroundColor }}
              >
                <h3 className="text-2xl text-gray-700 mb-2" style={{ fontFamily: 'Chalix, sans-serif' }}>
                  {pageContent.artCulture.exhibitions.title}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Chalix, sans-serif' }}>
                  {pageContent.artCulture.exhibitions.subtitle}
                </p>
              </CardContent>
            </Card>

            {/* Events Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md"
              onClick={() => handleCardClick('events')}
            >
              <CardContent 
                className="p-8 h-48 flex flex-col justify-end relative rounded-xl"
                style={{ backgroundColor: pageContent.artCulture.events.backgroundColor }}
              >
                <h3 className="text-2xl text-gray-700 mb-2" style={{ fontFamily: 'Chalix, sans-serif' }}>
                  {pageContent.artCulture.events.title}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Chalix, sans-serif' }}>
                  {pageContent.artCulture.events.subtitle}
                </p>
              </CardContent>
            </Card>

            {/* NFTs Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md"
              onClick={() => handleCardClick('nfts')}
            >
              <CardContent 
                className="p-8 h-48 flex flex-col justify-end relative rounded-xl"
                style={{ backgroundColor: pageContent.artCulture.nfts.backgroundColor }}
              >
                <h3 className="text-2xl text-gray-700 mb-2" style={{ fontFamily: 'Chalix, sans-serif' }}>
                  {pageContent.artCulture.nfts.title}
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Chalix, sans-serif' }}>
                  {pageContent.artCulture.nfts.subtitle}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Fashion Houses Section */}
        <section>
          <h2 className="text-4xl text-gray-600 mb-8" style={{ fontFamily: 'Chalix, sans-serif' }}>
            {pageContent.fashionHouses.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pageContent.fashionHouses.brands.map((brand) => (
              <Card 
                key={brand.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md"
                onClick={() => handleCardClick('fashion-house', brand.id)}
              >
                <CardContent 
                  className="p-8 h-48 flex flex-col justify-end relative rounded-xl"
                  style={{ backgroundColor: brand.backgroundColor }}
                >
                  <h3 className="text-2xl text-gray-700 mb-2" style={{ fontFamily: 'Chalix, sans-serif' }}>
                    {brand.name}
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Chalix, sans-serif' }}>
                    {brand.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional empty cards for future brands */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4].map((index) => (
              <Card 
                key={`empty-${index}`}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md"
                onClick={() => handleCardClick('empty-slot', `slot-${index}`)}
              >
                <CardContent 
                  className="p-8 h-48 flex flex-col justify-center items-center relative rounded-xl"
                  style={{ backgroundColor: "#F4E97A" }}
                >
                  <div className="text-gray-400 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">+</span>
                    </div>
                    <p className="text-sm" style={{ fontFamily: 'Chalix, sans-serif' }}>Add Brand</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};