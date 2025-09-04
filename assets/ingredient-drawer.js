class IngredientDrawer extends HTMLElement {
  constructor() {
    super();
    
    this.drawer = this.querySelector('.ingredient-drawer');
    this.overlay = this.querySelector('.page-overlay-ingredient');
    this.closeButton = this.querySelector('.ingredient-drawer__close');
    this.image = this.querySelector('.ingredient-drawer__img');
    this.title = this.querySelector('.ingredient-drawer__title');
    this.description = this.querySelector('.ingredient-drawer__description');
    
    this.body = document.body;
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    // Add drawers-animated class to body for smooth transitions
    this.body.classList.add('drawers-animated');
    
    // Add click event to close button
    this.closeButton.addEventListener('click', () => this.close());
    
    // Add click event to overlay
    this.overlay.addEventListener('click', () => this.close());
    
    // Add click events to all ingredient card triggers
    this.bindIngredientTriggers();
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }
  
  bindIngredientTriggers() {
    const triggers = document.querySelectorAll('.ingredient-card-trigger');
    console.log('Found triggers:', triggers.length);
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const name = trigger.dataset.ingredientName;
        const imageUrl = trigger.dataset.ingredientImage;
        const description = trigger.dataset.ingredientFullDescription;
        
        this.open(name, imageUrl, description);
      });
    });
  }
  
  open(name, imageUrl, description) {
    // Set content
    console.log('Opening drawer with:', { name, imageUrl, description });
    console.log('DOM elements:', { title: this.title, image: this.image, description: this.description });
    
    if (this.title) this.title.textContent = name;
    if (this.image) {
      this.image.src = imageUrl;
      this.image.alt = name;
    }
    if (this.description) this.description.innerHTML = description;
    
    // Open drawer
    this.drawer.classList.add('ingredient-drawer--open');
    this.body.classList.add('page-overlay-ingredient-on');
    this.isOpen = true;
    
    // Focus management
    this.closeButton.focus();
    
    // Prevent body scroll
    this.body.style.overflow = 'hidden';
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('ingredient-drawer:opened', {
      detail: { name, imageUrl, description }
    }));
  }
  
  close() {
    this.drawer.classList.remove('ingredient-drawer--open');
    this.body.classList.remove('page-overlay-ingredient-on');
    this.isOpen = false;
    
    // Restore body scroll
    this.body.style.overflow = '';
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('ingredient-drawer:closed'));
  }
}

// Register the custom element
customElements.define('ingredient-drawer', IngredientDrawer);