import React, { useState } from 'react';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import { Page } from '../App';

interface NewArchivePageProps {
  onNavigate: (page: Page) => void;
  selectedBrand: string | null;
}

// Editable content structure for backend integration
const archiveContent = {
  header: {
    title: "Aeternum",
    membershipLabel: "Membership",
    walletLabel: "Wallet",
    walletColor: "#F4E97A"
  },
  brandInfo: {
    dior: {
      name: "Dior",
      description: "A legacy of elegance and innovation, Dior defined post-war fashion with the New Look and continues to shape haute couture's modern identity."
    },
    chanel: {
      name: "Chanel", 
      description: "From the little black dress to timeless tweed, Chanel revolutionized women's fashion with elegant simplicity."
    },
    hermes: {
      name: "Hermès",
      description: "Renowned for craftsmanship and heritage, Hermès represents the pinnacle of luxury leather goods and accessories."
    },
    balenciaga: {
      name: "Balenciaga",
      description: "Cristóbal Balenciaga's bold silhouettes and today's avant-garde edge define architectural fashion."
    }
  },
  archiveItems: [
    {
      id: 1,
      title: "The Tailleur Bar worn by Renée Breton",
      brand: "dior",
      placeholder: true
    },
    {
      id: 2, 
      title: "haute couture Spring-Summer 1948",
      brand: "dior",
      placeholder: true
    },
    {
      id: 3,
      title: "haute couture Spring-Summer 1948 show", 
      brand: "dior",
      placeholder: true
    }
  ]
};

export const NewArchivePage: React.FC<NewArchivePageProps> = ({ onNavigate, selectedBrand }) => {
  const [membershipOpen, setMembershipOpen] = useState(false);
  
  const currentBrand = selectedBrand || 'dior';
  const brandInfo = archiveContent.brandInfo[currentBrand as keyof typeof archiveContent.brandInfo];
  
  const handleImageUpload = (itemId: number) => {
    console.log(`Image upload triggered for item ${itemId}`);
    // This will be connected to backend image upload functionality
  };

  const mockImageList = [
    "kxiIw8kN-q25BUEeMuK6oqk-qxp6YE6LKC_rFbPEf6I",
    "NP9deZ_xjaRRyuZ52F27jtsABEqA62jqNrdak3nt-6Q",
    "iZXRvhU2NrQsI0qSW1h-tXyqBIACWoQErLKwjKtz2Iw",
    "g5-szL9S-25PRF8Fd52PCZ7C4PjhRvVLioDqBtxcEQM"
  ]

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * mockImageList.length);
    return `http://arweave.net/${mockImageList[randomIndex]}`;
  };

  const handleItemEdit = (itemId: number, field: string, value: string) => {
    console.log(`Edit item ${itemId}, field: ${field}, value: ${value}`);
    // This will be connected to backend update functionality
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Chalix, sans-serif' }}>
      {/* Header */}
      <header className="bg-white rounded-b-[2rem] shadow-sm p-6 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost" 
              onClick={() => onNavigate('heritage')}
              className="text-gray-600 hover:text-gray-800"
              style={{ fontFamily: 'Chalix, sans-serif' }}
            >
              ← Back
            </Button>
            <h1 className="text-4xl text-gray-800" style={{ fontFamily: 'Chalix, sans-serif' }}>
              {archiveContent.header.title}
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
                style={{ fontFamily: 'Chalix, sans-serif' }}
                onClick={() => setMembershipOpen(!membershipOpen)}
              >
                <span>{archiveContent.header.membershipLabel}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              className="px-6 py-2 rounded-full text-black hover:opacity-80 transition-opacity"
              style={{ backgroundColor: archiveContent.header.walletColor, fontFamily: 'Chalix, sans-serif' }}
            >
              {archiveContent.header.walletLabel}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6">
        {/* Brand Info Section */}
        <section className="text-center mb-12">
          <h2 className="text-6xl text-gray-800 mb-6" style={{ fontFamily: 'Chalix, sans-serif' }}>
            {brandInfo?.name || 'Brand'}
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Chalix, sans-serif' }}>
            {brandInfo?.description || 'Brand description will appear here.'}
          </p>
        </section>

        {/* Archive Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {archiveContent.archiveItems.map((item) => (
            <div key={item.id} className="space-y-4">
              {/* Image Placeholder */}
                  <div 
                    className="aspect-[4/5] bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-400 transition-colors flex items-center justify-center group"
                    // onClick={() => handleImageUpload(item.id)}
                  >
                    <img src={getRandomImage()} alt="" />
                  </div>
              
              {/* Item Title */}
              <div 
                className="text-center cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                onClick={() => {
                  const newTitle = prompt('Edit title:', item.title);
                  if (newTitle) handleItemEdit(item.id, 'title', newTitle);
                }}
              >
                <h3 className="text-lg text-gray-800" style={{ fontFamily: 'Chalix, sans-serif' }}>
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
          
          {/* Add more items button */}
          {/* <div className="space-y-4">
            <div 
              className="aspect-[4/5] bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors flex items-center justify-center"
              onClick={() => console.log('Add new archive item')}
            >
              <div className="text-center text-gray-500">
                <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">+</span>
                </div>
                <p className="text-sm" style={{ fontFamily: 'Chalix, sans-serif' }}>Add Archive Item</p>
              </div>
            </div>
          </div> */}
        </section>
      </div>
    </div>
  );
};