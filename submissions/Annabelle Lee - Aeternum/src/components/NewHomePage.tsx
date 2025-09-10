import React from 'react';
import { Button } from './ui/button';
import { Page } from '../App';
import { ConnectButton } from "arweave-wallet-kit";
import heritageBackgroundImage from '../assets/1201fa4691327b62d764de0e058d7844d176f2b2.png';

interface NewHomePageProps {
  onNavigate: (page: Page) => void;
}

export const NewHomePage: React.FC<NewHomePageProps> = ({ onNavigate }) => {
  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${heritageBackgroundImage})`
      }}
    >
      {/* Grey overlay for mysterious sense */}
      <div className="absolute inset-0 bg-gray-900/40" />

      {/* Header */}
      <header className="relative z-20 p-8 flex justify-end">

        <div className="bg-transparent border-2 border-[#F4E97A] text-[#F4E97A] hover:bg-[#F4E97A] hover:text-black transition-all duration-300 px-6 py-2 rounded-full font-medium" style={{ fontFamily: 'Chalix, sans-serif' }}>

          <ConnectButton
            className="connect-button"
            profileModal={false}
            showBalance={false}
            accent="#667eea"
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              backgroundColor: "transparent",
              padding: 0,
            }}
            onClick={() => {/* Wallet connection logic */ }}
          >
            Connect Wallet
          </ConnectButton>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center">
        {/* Main Title */}
        <div className="mb-8">
          <h1
            className="text-8xl md:text-9xl text-white mb-4 relative"
            style={{ fontFamily: 'Chalix, sans-serif' }}
          >
            Aeternum
            {/* Yellow brush stroke behind text */}
            <div
              className="absolute -inset-4 -z-10"
              style={{
                background: 'linear-gradient(45deg, #F4E97A 0%, #E6D85C 100%)',
                transform: 'rotate(-2deg) skew(-5deg)',
                borderRadius: '20px',
                opacity: 0.9
              }}
            />
          </h1>
        </div>

        {/* Heritage Button */}
        <Button
          className="bg-transparent border-2 border-[#F4E97A] text-[#F4E97A] hover:bg-[#F4E97A] hover:text-black transition-all duration-500 px-12 py-4 text-2xl rounded-full relative overflow-hidden"
          onClick={() => onNavigate('heritage')}
          style={{ fontFamily: 'Chalix, sans-serif' }}
        >
          Heritage
          {/* Yellow brush stroke behind text */}
          <div
            className="absolute -inset-2 -z-10"
            style={{
              background: 'linear-gradient(45deg, #F4E97A 0%, #E6D85C 100%)',
              transform: 'rotate(-1deg)',
              borderRadius: '30px',
              opacity: 0.2
            }}
          />
        </Button>
      </div>
    </div>
  );
};