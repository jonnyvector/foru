document.addEventListener('DOMContentLoaded', function() {
  // Handle tooltip triggers
  const tooltipTriggers = document.querySelectorAll('.hero__info-tooltip-trigger');
  
  tooltipTriggers.forEach(trigger => {
    const tooltipId = trigger.getAttribute('aria-describedby');
    const tooltip = document.getElementById(tooltipId);
    
    if (tooltip) {
      // Show tooltip on click
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other tooltips
        document.querySelectorAll('.hero__info-tooltip-content').forEach(content => {
          if (content !== tooltip) {
            content.setAttribute('aria-hidden', 'true');
          }
        });
        
        // Toggle this tooltip
        const isHidden = tooltip.getAttribute('aria-hidden') === 'true';
        tooltip.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
      });
      
      // Close tooltip on close button click
      const closeBtn = tooltip.querySelector('.hero__info-tooltip-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          tooltip.setAttribute('aria-hidden', 'true');
        });
      }
    }
  });
  
  // Close tooltips when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.hero__info-tooltip')) {
      document.querySelectorAll('.hero__info-tooltip-content').forEach(tooltip => {
        tooltip.setAttribute('aria-hidden', 'true');
      });
    }
  });
  
  // Close tooltips on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.hero__info-tooltip-content').forEach(tooltip => {
        tooltip.setAttribute('aria-hidden', 'true');
      });
    }
  });
});