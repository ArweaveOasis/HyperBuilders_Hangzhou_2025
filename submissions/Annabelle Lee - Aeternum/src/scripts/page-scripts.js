// Homepage JavaScript functionality
export const homePageScript = {
  // Initialize homepage with smooth scrolling and animations
  init() {
    console.log('Homepage initialized');
    
    // Add smooth hover effects for buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.transition = 'all 0.3s ease';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });

    // Parallax effect for background images
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const backgrounds = document.querySelectorAll('[data-parallax]');
      backgrounds.forEach(bg => {
        const speed = bg.dataset.speed || 0.5;
        bg.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  },

  // Wallet connection functionality
  async connectWallet() {
    try {
      // This would integrate with Web3 wallet providers
      console.log('Connecting to wallet...');
      
      // Mock wallet connection
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Wallet connected successfully');
          resolve({ address: '0x123...abc', balance: '1.5 ETH' });
        }, 2000);
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }
};

// Heritage Page JavaScript functionality
export const heritagePageScript = {
  init() {
    console.log('Heritage page initialized');
    
    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('opacity-0');
            img.classList.add('opacity-100');
            observer.unobserve(img);
          }
        }
      });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));

    // Add click tracking for analytics
    const brandCards = document.querySelectorAll('[data-brand-id]');
    brandCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const brandId = e.currentTarget.dataset.brandId;
        this.trackBrandClick(brandId);
      });
    });
  },

  // Track user interactions for analytics
  trackBrandClick(brandId) {
    console.log(`Brand clicked: ${brandId}`);
    
    // This would send data to analytics service
    const eventData = {
      event: 'brand_selected',
      brand_id: brandId,
      timestamp: new Date().toISOString(),
      page: 'heritage'
    };
    
    // Mock analytics call
    this.sendAnalytics(eventData);
  },

  sendAnalytics(data) {
    // Mock analytics implementation
    console.log('Analytics data:', data);
    
    // In production, this would send to services like Google Analytics, Mixpanel, etc.
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
  }
};

// Archive Page JavaScript functionality
export const archivePageScript = {
  init() {
    console.log('Archive page initialized');
    
    // Initialize masonry layout for responsive grid
    this.initMasonryLayout();
    
    // Setup search functionality
    this.initSearch();
    
    // Setup filtering
    this.initFilters();
  },

  // Masonry layout for archive items
  initMasonryLayout() {
    const grid = document.querySelector('.archive-grid');
    if (!grid) return;

    // Simple masonry-like effect using CSS Grid
    const resizeObserver = new ResizeObserver(() => {
      this.adjustGridLayout();
    });
    
    resizeObserver.observe(grid);
  },

  adjustGridLayout() {
    const items = document.querySelectorAll('.archive-item');
    items.forEach((item, index) => {
      // Stagger animations
      item.style.animationDelay = `${index * 0.1}s`;
    });
  },

  // Search functionality
  initSearch() {
    const searchInput = document.querySelector('#archive-search');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });
  },

  performSearch(query) {
    console.log(`Searching for: ${query}`);
    
    const items = document.querySelectorAll('.archive-item');
    items.forEach(item => {
      const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
      const description = item.querySelector('.description')?.textContent.toLowerCase() || '';
      const brand = item.querySelector('.brand')?.textContent.toLowerCase() || '';
      
      const isMatch = title.includes(query.toLowerCase()) || 
                     description.includes(query.toLowerCase()) ||
                     brand.includes(query.toLowerCase());
      
      if (isMatch || query === '') {
        item.style.display = 'block';
        item.classList.remove('hidden');
      } else {
        item.style.display = 'none';
        item.classList.add('hidden');
      }
    });

    // Update results count
    const visibleItems = document.querySelectorAll('.archive-item:not(.hidden)').length;
    this.updateResultsCount(visibleItems);
  },

  // Category filtering
  initFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        this.applyFilter(filter);
        
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
      });
    });
  },

  applyFilter(category) {
    console.log(`Filtering by category: ${category}`);
    
    const items = document.querySelectorAll('.archive-item');
    items.forEach(item => {
      const itemCategory = item.dataset.category;
      
      if (category === 'all' || itemCategory === category) {
        item.style.display = 'block';
        item.classList.remove('filtered-out');
      } else {
        item.style.display = 'none';
        item.classList.add('filtered-out');
      }
    });

    const visibleItems = document.querySelectorAll('.archive-item:not(.filtered-out)').length;
    this.updateResultsCount(visibleItems);
  },

  updateResultsCount(count) {
    const counter = document.querySelector('#results-count');
    if (counter) {
      counter.textContent = `${count} items`;
    }
  },

  // Export functionality for archive items
  exportArchiveData() {
    const items = Array.from(document.querySelectorAll('.archive-item')).map(item => ({
      title: item.querySelector('h3')?.textContent || '',
      brand: item.querySelector('.brand')?.textContent || '',
      year: item.querySelector('.year')?.textContent || '',
      description: item.querySelector('.description')?.textContent || '',
      category: item.dataset.category || '',
      image: item.querySelector('img')?.src || ''
    }));

    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'fashion-archive-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
};

// Global utility functions
export const utils = {
  // Format dates consistently across the application
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Debounce function for search and other inputs
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Image loading with fallback
  loadImageWithFallback(imgElement, fallbackSrc) {
    imgElement.onerror = function() {
      this.src = fallbackSrc;
      this.onerror = null;
    };
  },

  // Smooth scroll to element
  scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
};

// Initialize appropriate script based on current page
export const pageManager = {
  init() {
    const currentPage = this.getCurrentPage();
    
    switch(currentPage) {
      case 'home':
        homePageScript.init();
        break;
      case 'heritage':
        heritagePageScript.init();
        break;
      case 'archive':
        archivePageScript.init();
        break;
      default:
        console.log('Page not recognized');
    }
  },

  getCurrentPage() {
    // This would be determined by your routing logic
    // For now, detect based on URL or page identifier
    const path = window.location.pathname;
    
    if (path.includes('heritage')) return 'heritage';
    if (path.includes('archive')) return 'archive';
    return 'home';
  }
};

// Auto-initialize when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    pageManager.init();
  });
}