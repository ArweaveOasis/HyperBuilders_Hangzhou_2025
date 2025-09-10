import React from 'react';
import { Button } from './ui/button';
import { Page } from '../App';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-8">
        <div className="flex justify-between items-center">
          <div className="text-white text-2xl tracking-widest">
            WORLD OF FASHION
          </div>
          <Button
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-6 py-2"
            onClick={() => {/* Wallet connection logic */}}
          >
            CONNECT TO WALLET
          </Button>
        </div>
      </header>

      {/* Hero Section - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Panel - Fashion & Accessories */}
        <div className="relative bg-gradient-to-br from-gray-900 to-black flex flex-col justify-center items-center text-white p-8">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1580698864216-8008843ce6b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwbW9kZWwlMjBlbGVnYW50fGVufDF8fHx8MTc1NzM5NTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080')`
            }}
          />
          <div className="relative z-10 text-center max-w-md">
            <h2 className="text-4xl mb-4 tracking-wide">Fashion & Accessories</h2>
            <p className="text-lg opacity-80 mb-8">Discover the evolution of style</p>
            <Button
              variant="link"
              className="text-white hover:text-gray-300 text-base tracking-wide"
            >
              Explore now
            </Button>
          </div>
        </div>

        {/* Right Panel - Heritage & Legacy */}
        <div className="relative bg-gradient-to-bl from-gray-800 to-gray-900 flex flex-col justify-center items-center text-white p-8">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1718963581729-673ed905416a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduJTIwYXRlbGllcnxlbnwxfHx8fDE3NTczOTU0NzN8MA&ixlib=rb-4.1.0&q=80&w=1080')`
            }}
          />
          <div className="relative z-10 text-center max-w-md">
            <h2 className="text-4xl mb-4 tracking-wide">Heritage & Legacy</h2>
            <p className="text-lg opacity-80 mb-8">Journey through fashion history</p>
            <Button
              variant="link"
              className="text-white hover:text-gray-300 text-base tracking-wide"
            >
              Discover now
            </Button>
          </div>
        </div>
      </div>

      {/* Central Heritage Button */}
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <Button
          variant="outline"
          className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-500 px-12 py-4 text-xl tracking-widest pointer-events-auto backdrop-blur-sm"
          onClick={() => onNavigate('heritage')}
        >
          HERITAGE
        </Button>
      </div>

      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
    </div>
  );
};