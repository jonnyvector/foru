class IngredientsNavigation extends HTMLElement {
  constructor() {
    super();
    this.navLinks = this.querySelectorAll('.ingredients-navigation__link');
    this.sections = [];
    
    this.init();
  }

  init() {
    // Collect all target sections
    this.navLinks.forEach(link => {
      const handle = link.getAttribute('data-product-handle');
      if (handle) {
        const section = document.getElementById(handle);
        if (section) {
          this.sections.push({
            element: section,
            link: link,
            handle: handle
          });
        }
      }
    });

    // Set up scroll listener for active states
    if (this.sections.length > 0) {
      this.handleScroll = this.throttle(this.updateActiveStates.bind(this), 100);
      window.addEventListener('scroll', this.handleScroll);
    }

    // Handle click events for smooth scrolling
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });
  }

  handleNavClick(event) {
    event.preventDefault();
    const handle = event.target.getAttribute('data-product-handle');
    const targetSection = document.getElementById(handle);
    
    if (targetSection) {
      // Get the header height to offset scroll position
      const header = document.querySelector('.shopify-section-header');
      const headerHeight = header ? header.offsetHeight : 0;
      const offset = 20; // Additional offset for breathing room
      
      const targetPosition = targetSection.offsetTop - headerHeight - offset;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  updateActiveStates() {
    if (this.sections.length === 0) return;

    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Find the section that's currently most visible
    let activeSection = null;
    let maxVisibility = 0;

    this.sections.forEach(({ element, link, handle }) => {
      const rect = element.getBoundingClientRect();
      const sectionTop = rect.top + scrollTop;
      const sectionBottom = sectionTop + rect.height;
      
      // Calculate how much of the section is visible
      const visibleTop = Math.max(scrollTop, sectionTop);
      const visibleBottom = Math.min(scrollTop + windowHeight, sectionBottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibilityRatio = visibleHeight / rect.height;
      
      if (visibilityRatio > maxVisibility) {
        maxVisibility = visibilityRatio;
        activeSection = { element, link, handle };
      }
    });

    // Update active states
    this.sections.forEach(({ link }) => {
      link.classList.remove('ingredients-navigation__link--active');
    });

    if (activeSection) {
      activeSection.link.classList.add('ingredients-navigation__link--active');
    }
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  disconnectedCallback() {
    if (this.handleScroll) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
}

// Auto-initialize when element is found
document.addEventListener('DOMContentLoaded', () => {
  const ingredientsNavs = document.querySelectorAll('secondary-nav[data-ingredients-nav]');
  ingredientsNavs.forEach(nav => {
    if (!nav.ingredientsNavigationInitialized) {
      new IngredientsNavigation.call(nav);
      nav.ingredientsNavigationInitialized = true;
    }
  });
});

export default IngredientsNavigation;