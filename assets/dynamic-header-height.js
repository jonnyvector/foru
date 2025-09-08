/**
 * Dynamic Header Height Calculator
 * Scoped to only affect hero banner sections on mobile
 */
(function() {
  'use strict';
  
  // Only run on mobile
  function isMobile() {
    return window.innerWidth <= 899;
  }
  
  // Calculate total header height (header + announcement bar)
  function calculateHeaderHeight() {
    if (!isMobile()) return;
    
    const header = document.querySelector('header[id*="shopify-section-"]');
    const announcementBar = document.querySelector('.announcement-bar, [class*="announcement"]');
    
    if (!header) return;
    
    let totalHeight = header.offsetHeight;
    
    // Add announcement bar height if visible
    if (announcementBar && announcementBar.offsetHeight > 0) {
      totalHeight += announcementBar.offsetHeight;
    }
    
    // Set CSS custom property for banner sections to use
    document.documentElement.style.setProperty('--dynamic-header-height', totalHeight + 'px');
    
    console.log('Dynamic header height set to:', totalHeight + 'px');
  }
  
  // Debounced calculation to prevent excessive calls
  let debounceTimer;
  function debouncedCalculate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(calculateHeaderHeight, 100);
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', calculateHeaderHeight);
  } else {
    calculateHeaderHeight();
  }
  
  // Recalculate on resize
  window.addEventListener('resize', debouncedCalculate);
  
  // Watch for announcement bar changes
  const observer = new MutationObserver(debouncedCalculate);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
  
})();