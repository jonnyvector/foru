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
        
        // Close other tooltips and reset their triggers
        document.querySelectorAll('.hero__info-tooltip-trigger').forEach(otherTrigger => {
          if (otherTrigger !== trigger) {
            const otherTooltipId = otherTrigger.getAttribute('aria-describedby');
            const otherTooltip = document.getElementById(otherTooltipId);
            if (otherTooltip) {
              otherTooltip.setAttribute('aria-hidden', 'true');
              otherTrigger.setAttribute('aria-expanded', 'false');
            }
          }
        });
        
        // Toggle this tooltip
        const isHidden = tooltip.getAttribute('aria-hidden') === 'true';
        tooltip.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
        trigger.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        
        // On mobile, move tooltip to body to prevent clipping
        if (window.innerWidth <= 899 && isHidden) {
          document.body.appendChild(tooltip);
          tooltip.classList.add('mobile-body-tooltip');
        }
      });
    }
  });
  
  // Close tooltips when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.hero__info-tooltip')) {
      document.querySelectorAll('.hero__info-tooltip-trigger').forEach(trigger => {
        const tooltipId = trigger.getAttribute('aria-describedby');
        const tooltip = document.getElementById(tooltipId);
        if (tooltip) {
          tooltip.setAttribute('aria-hidden', 'true');
          trigger.setAttribute('aria-expanded', 'false');
          
          // Move tooltip back to original container if it was moved to body
          if (tooltip.parentElement === document.body) {
            const tooltipContainer = trigger.parentElement;
            tooltipContainer.appendChild(tooltip);
          }
        }
      });
    }
  });
  
  // Close tooltips on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.hero__info-tooltip-trigger').forEach(trigger => {
        const tooltipId = trigger.getAttribute('aria-describedby');
        const tooltip = document.getElementById(tooltipId);
        if (tooltip) {
          tooltip.setAttribute('aria-hidden', 'true');
          trigger.setAttribute('aria-expanded', 'false');
          
          // Move tooltip back to original container if it was moved to body
          if (tooltip.parentElement === document.body) {
            const tooltipContainer = trigger.parentElement;
            tooltipContainer.appendChild(tooltip);
          }
        }
      });
    }
  });
});