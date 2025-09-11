// Aeternum Frontend JavaScript Utilities
// Editable content management for backend integration

// Content Management System
export const ContentManager = {
  // Homepage content management
  homepage: {
    content: {
      title: "Aeternum",
      heritageButton: "Heritage",
      connectWalletButton: "Connect Wallet"
    },
    
    // Update homepage content
    updateContent(field, value) {
      this.content[field] = value;
      this.renderHomepage();
      console.log(`Homepage ${field} updated to: ${value}`);
    },
    
    // Render homepage with current content
    renderHomepage() {
      const titleElement = document.querySelector('[data-homepage-title]');
      const heritageButton = document.querySelector('[data-homepage-heritage-btn]');
      const walletButton = document.querySelector('[data-homepage-wallet-btn]');
      
      if (titleElement) titleElement.textContent = this.content.title;
      if (heritageButton) heritageButton.textContent = this.content.heritageButton;
      if (walletButton) walletButton.textContent = this.content.connectWalletButton;
    }
  },

  // Heritage page content management
  heritagePage: {
    content: {
      artCulture: {
        title: "Art & Culture",
        exhibitions: {
          title: "Exhibitions",
          subtitle: "In-house exhibition coming up on Sep 20, 2025"
        },
        events: {
          title: "Events",
          subtitle: "SS 2026 Haute Couture in Paris"
        },
        nfts: {
          title: "NFTs", 
          subtitle: "Holder will participate in House Events"
        }
      },
      fashionHouses: {
        title: "Fashion Houses",
        brands: [
          {
            id: "dior",
            name: "Dior",
            subtitle: "A legacy of elegance and innovation"
          },
          {
            id: "chanel",
            name: "Chanel", 
            subtitle: "From the little black dress to timeless tweed"
          },
          {
            id: "hermes",
            name: "Hermès",
            subtitle: "Renowned for craftsmanship and heritage"
          },
          {
            id: "balenciaga", 
            name: "Balenciaga",
            subtitle: "Cristóbal Balenciaga's bold silhouettes and today's avant-garde edge"
          }
        ]
      }
    },

    // Update heritage page content
    updateArtCultureCard(cardType, field, value) {
      if (this.content.artCulture[cardType]) {
        this.content.artCulture[cardType][field] = value;
        this.renderHeritageCards();
        console.log(`${cardType} ${field} updated to: ${value}`);
      }
    },

    // Update brand information
    updateBrand(brandId, field, value) {
      const brand = this.content.fashionHouses.brands.find(b => b.id === brandId);
      if (brand) {
        brand[field] = value;
        this.renderBrandCards();
        console.log(`Brand ${brandId} ${field} updated to: ${value}`);
      }
    },

    // Add new brand
    addBrand(brandData) {
      this.content.fashionHouses.brands.push({
        id: brandData.id || `brand_${Date.now()}`,
        name: brandData.name,
        subtitle: brandData.subtitle
      });
      this.renderBrandCards();
      console.log('New brand added:', brandData);
    },

    // Remove brand
    removeBrand(brandId) {
      const index = this.content.fashionHouses.brands.findIndex(b => b.id === brandId);
      if (index > -1) {
        this.content.fashionHouses.brands.splice(index, 1);
        this.renderBrandCards();
        console.log(`Brand ${brandId} removed`);
      }
    },

    // Render heritage page cards
    renderHeritageCards() {
      // This would update the DOM elements with current content
      console.log('Rendering heritage cards with updated content');
    },

    renderBrandCards() {
      // This would update the brand cards in the DOM
      console.log('Rendering brand cards with updated content');
    }
  },

  // Archive page content management
  archivePage: {
    content: {
      brands: {
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
          image: null,
          description: ""
        },
        {
          id: 2,
          title: "haute couture Spring-Summer 1948", 
          brand: "dior",
          image: null,
          description: ""
        },
        {
          id: 3,
          title: "haute couture Spring-Summer 1948 show",
          brand: "dior", 
          image: null,
          description: ""
        }
      ]
    },

    // Update brand information
    updateBrandInfo(brandId, field, value) {
      if (this.content.brands[brandId]) {
        this.content.brands[brandId][field] = value;
        this.renderBrandInfo(brandId);
        console.log(`Brand ${brandId} ${field} updated to: ${value}`);
      }
    },

    // Update archive item
    updateArchiveItem(itemId, field, value) {
      const item = this.content.archiveItems.find(i => i.id === itemId);
      if (item) {
        item[field] = value;
        this.renderArchiveItem(itemId);
        console.log(`Archive item ${itemId} ${field} updated to: ${value}`);
      }
    },

    // Add new archive item
    addArchiveItem(itemData) {
      const newItem = {
        id: itemData.id || Date.now(),
        title: itemData.title || "New Archive Item",
        brand: itemData.brand,
        image: itemData.image || null,
        description: itemData.description || ""
      };
      this.content.archiveItems.push(newItem);
      this.renderArchiveGrid();
      console.log('New archive item added:', newItem);
    },

    // Remove archive item
    removeArchiveItem(itemId) {
      const index = this.content.archiveItems.findIndex(i => i.id === itemId);
      if (index > -1) {
        this.content.archiveItems.splice(index, 1);
        this.renderArchiveGrid();
        console.log(`Archive item ${itemId} removed`);
      }
    },

    // Render functions
    renderBrandInfo(brandId) {
      console.log(`Rendering brand info for ${brandId}`);
    },

    renderArchiveItem(itemId) {
      console.log(`Rendering archive item ${itemId}`);
    },

    renderArchiveGrid() {
      console.log('Rendering archive grid');
    }
  }
};

// Image Upload Functionality
export const ImageUploader = {
  // Upload image for archive items
  async uploadArchiveImage(itemId, file) {
    try {
      console.log(`Uploading image for archive item ${itemId}:`, file.name);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);
      formData.append('itemId', itemId.toString());
      formData.append('type', 'archive');
      
      // This will be connected to your backend upload endpoint
      // const response = await fetch('/api/upload-image', {
      //   method: 'POST',
      //   body: formData
      // });
      
      // Mock response for now
      const mockImageUrl = URL.createObjectURL(file);
      
      // Update content manager with new image
      ContentManager.archivePage.updateArchiveItem(itemId, 'image', mockImageUrl);
      
      return {
        success: true,
        imageUrl: mockImageUrl
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Upload background images for cards
  async uploadCardBackground(cardType, cardId, file) {
    try {
      console.log(`Uploading background for ${cardType} card ${cardId}:`, file.name);
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('cardId', cardId);
      formData.append('type', cardType);
      
      // Mock response
      const mockImageUrl = URL.createObjectURL(file);
      
      return {
        success: true,
        imageUrl: mockImageUrl
      };
    } catch (error) {
      console.error('Error uploading card background:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// Analytics and User Interaction Tracking
export const Analytics = {
  // Track user interactions
  trackEvent(eventType, eventData) {
    console.log('Analytics Event:', eventType, eventData);
    
    // This will be connected to your analytics service
    const event = {
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId()
    };
    
    // Store locally for now
    const events = JSON.parse(localStorage.getItem('aeternum_events') || '[]');
    events.push(event);
    localStorage.setItem('aeternum_events', JSON.stringify(events));
  },

  // Get or create session ID
  getSessionId() {
    let sessionId = localStorage.getItem('aeternum_session');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('aeternum_session', sessionId);
    }
    return sessionId;
  },

  // Track page navigation
  trackPageView(pageName, additionalData = {}) {
    this.trackEvent('page_view', {
      page: pageName,
      ...additionalData
    });
  },

  // Track card interactions
  trackCardClick(cardType, cardId, additionalData = {}) {
    this.trackEvent('card_click', {
      cardType,
      cardId,
      ...additionalData
    });
  },

  // Track image uploads
  trackImageUpload(itemType, itemId, success) {
    this.trackEvent('image_upload', {
      itemType,
      itemId,
      success
    });
  }
};

// Wallet Integration Utilities
export const WalletManager = {
  connected: false,
  address: null,
  
  // Connect wallet (placeholder for Web3 integration)
  async connectWallet() {
    try {
      console.log('Attempting to connect wallet...');
      
      // This will be replaced with actual Web3 wallet connection
      // Example: MetaMask, WalletConnect, etc.
      
      // Mock connection for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      this.connected = true;
      this.address = mockAddress;
      
      // Update UI
      this.updateWalletUI();
      
      // Track connection
      Analytics.trackEvent('wallet_connect', {
        address: this.address,
        success: true
      });
      
      return {
        success: true,
        address: this.address
      };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      Analytics.trackEvent('wallet_connect', {
        success: false,
        error: error.message
      });
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Disconnect wallet
  async disconnectWallet() {
    this.connected = false;
    this.address = null;
    this.updateWalletUI();
    
    Analytics.trackEvent('wallet_disconnect', {});
  },

  // Update wallet UI elements
  updateWalletUI() {
    const walletButtons = document.querySelectorAll('[data-wallet-btn]');
    walletButtons.forEach(btn => {
      if (this.connected) {
        btn.textContent = `${this.address.substr(0, 6)}...${this.address.substr(-4)}`;
        btn.classList.add('connected');
      } else {
        btn.textContent = 'Connect Wallet';
        btn.classList.remove('connected');
      }
    });
  }
};

// Data Persistence Utilities
export const DataManager = {
  // Save content to localStorage (temporary until backend is connected)
  saveContent(pageType, content) {
    try {
      localStorage.setItem(`aeternum_${pageType}`, JSON.stringify(content));
      console.log(`${pageType} content saved locally`);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  },

  // Load content from localStorage
  loadContent(pageType) {
    try {
      const content = localStorage.getItem(`aeternum_${pageType}`);
      return content ? JSON.parse(content) : null;
    } catch (error) {
      console.error('Error loading content:', error);
      return null;
    }
  },

  // Backend API calls (to be implemented)
  async syncWithBackend(pageType, content) {
    try {
      console.log(`Syncing ${pageType} with backend...`);
      
      // This will be your backend API call
      // const response = await fetch('/api/content/' + pageType, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(content)
      // });
      
      // Mock success for now
      return { success: true };
    } catch (error) {
      console.error('Backend sync failed:', error);
      return { success: false, error: error.message };
    }
  }
};

// Initialize the application
export const AeternumApp = {
  init() {
    console.log('Initializing Aeternum application...');
    
    // Load saved content
    const homeContent = DataManager.loadContent('homepage');
    const heritageContent = DataManager.loadContent('heritage');
    const archiveContent = DataManager.loadContent('archive');
    
    // Apply loaded content
    if (homeContent) {
      Object.assign(ContentManager.homepage.content, homeContent);
    }
    if (heritageContent) {
      Object.assign(ContentManager.heritagePage.content, heritageContent);
    }
    if (archiveContent) {
      Object.assign(ContentManager.archivePage.content, archiveContent);
    }
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Track app initialization
    Analytics.trackEvent('app_init', {
      timestamp: new Date().toISOString()
    });
  },

  setupEventListeners() {
    // Auto-save content changes
    window.addEventListener('beforeunload', () => {
      DataManager.saveContent('homepage', ContentManager.homepage.content);
      DataManager.saveContent('heritage', ContentManager.heritagePage.content);
      DataManager.saveContent('archive', ContentManager.archivePage.content);
    });
    
    // Handle file uploads
    document.addEventListener('change', (e) => {
      if (e.target.type === 'file' && e.target.files.length > 0) {
        const file = e.target.files[0];
        const itemId = e.target.dataset.itemId;
        const uploadType = e.target.dataset.uploadType;
        
        if (itemId && uploadType === 'archive') {
          ImageUploader.uploadArchiveImage(parseInt(itemId), file);
        }
      }
    });
  }
};

// Auto-initialize when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    AeternumApp.init();
  });
}

// Export all utilities for external use
export default {
  ContentManager,
  ImageUploader,
  Analytics,
  WalletManager,
  DataManager,
  AeternumApp
};