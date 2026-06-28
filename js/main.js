/* ============================================
   PARTNERS SUPPLY — Main JavaScript v3.0 (Refonte)
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // --- Check for reduced motion ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================
  // 1. MOBILE DRAWER TOGGLE
  // ============================================
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');
  const openBtn = document.getElementById('mobileOpen');
  const closeBtn = document.getElementById('mobileClose');

  if (openBtn && drawer && overlay) {
    openBtn.addEventListener('click', function() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
  }

  // ============================================
  // 2. SCROLL HEADER EFFECT
  // ============================================
  const header = document.querySelector('.header');

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ============================================
  // 3. ENHANCED SCROLL ANIMATIONS (IntersectionObserver)
  //    — FadeInUp with staggered delays
  // ============================================
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if (animateElements.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // Add a subtle staggered delay based on index or data attribute
            const delay = el.getAttribute('data-delay') || 
                          (el.classList.contains('animate-delay-1') ? '0.1s' :
                           el.classList.contains('animate-delay-2') ? '0.2s' :
                           el.classList.contains('animate-delay-3') ? '0.3s' :
                           el.classList.contains('animate-delay-4') ? '0.4s' : '0s');
            el.style.transitionDelay = delay;
            el.classList.add('is-visible');
            observer.unobserve(el);
          }
        });
      }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animateElements.forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
      });
    }

    // --- Card stagger within containers ---
    document.querySelectorAll('.stagger-container').forEach(container => {
      const cards = container.querySelectorAll('.stagger-item');
      if (cards.length > 0) {
        const cardObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const containerEl = entry.target;
              const items = containerEl.querySelectorAll('.stagger-item');
              items.forEach((card, index) => {
                setTimeout(() => {
                  card.classList.add('is-visible');
                }, index * 100); // 100ms stagger per card
              });
              cardObserver.unobserve(containerEl);
            }
          });
        }, { threshold: 0.15 });

        cardObserver.observe(container);
      }
    });

    // --- Product grid stagger ---
    document.querySelectorAll('.product-grid, .pillars-grid, .team-grid, .values-list, .services-grid, .features-strip, .process-grid').forEach(grid => {
      const items = grid.querySelectorAll('.animate-on-scroll');
      if (items.length > 0) {
        const gridObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const gridEl = entry.target;
              const children = gridEl.querySelectorAll('.animate-on-scroll');
              children.forEach((child, index) => {
                setTimeout(() => {
                  child.classList.add('is-visible');
                }, index * 120);
              });
              gridObserver.unobserve(gridEl);
            }
          });
        }, { threshold: 0.1 });
        gridObserver.observe(grid);
      }
    });
  } else {
    // Fallback: if reduced motion or no IntersectionObserver, show everything
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('is-visible');
    });
  }

  // ============================================
  // 4. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================
  // 5. ACTIVE NAVIGATION LINK
  // ============================================
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-desktop a, .mobile-drawer nav a, .nav-desktop .dropdown > a').forEach(link => {
    link.classList.remove('active');
  });

  let matched = false;
  document.querySelectorAll('.nav-desktop a, .mobile-drawer nav a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath && linkPath !== '#' && (currentPath.endsWith(linkPath) || (currentPath.endsWith('/') && linkPath === 'index.html'))) {
      link.classList.add('active');
      matched = true;
      if (link.closest('.dropdown-menu')) {
        const prodToggle = document.getElementById('nav-produits');
        if (prodToggle) prodToggle.classList.add('active');
      }
    }
  });

  if (!matched && (currentPath.endsWith('/') || currentPath === '')) {
    const homeLink = document.getElementById('nav-accueil');
    if (homeLink) homeLink.classList.add('active');
  }

  // ============================================
  // 6. ENHANCED COUNTER ANIMATION WITH PROGRESS BAR
  // ============================================
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2500; // slightly longer for smoother easing
    const startTime = performance.now();
    const suffix = element.getAttribute('data-suffix') || '';
    
    // Find or create progress bar
    const parent = element.parentElement;
    let progressBar = parent.querySelector('.counter-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'counter-progress';
      parent.appendChild(progressBar);
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.floor(easedProgress * target);

      element.textContent = current + suffix;

      // Update progress bar width
      if (progressBar) {
        progressBar.style.width = (easedProgress * 100) + '%';
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + suffix;
        if (progressBar) {
          progressBar.style.width = '100%';
        }
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // Observe counters
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  } else if (counters.length > 0) {
    // Fallback: animate immediately
    counters.forEach(counter => animateCounter(counter));
  }

  // ============================================
  // 7. CONTACT FORM — REAL-TIME VALIDATION
  // ============================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(field) {
      const formGroup = field.closest('.form-group');
      let errorMsg = formGroup.querySelector('.error-message');
      
      // Remove existing error
      if (errorMsg) {
        errorMsg.remove();
      }
      field.classList.remove('is-invalid', 'is-valid');

      let isValid = true;
      let message = '';

      if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        message = 'Ce champ est requis';
      } else if (field.type === 'email' && field.value.trim() && !emailRegex.test(field.value.trim())) {
        isValid = false;
        message = 'Veuillez entrer une adresse email valide';
      }

      if (!isValid) {
        field.classList.add('is-invalid');
        errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        formGroup.appendChild(errorMsg);
      } else if (field.value.trim()) {
        field.classList.add('is-valid');
      }

      return isValid;
    }

    // Real-time validation on blur and input
    inputs.forEach(input => {
      input.addEventListener('blur', function() { validateField(this); });
      input.addEventListener('input', function() {
        if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
          validateField(this);
        }
      });
    });

    // Form submission validation
    contactForm.addEventListener('submit', function(e) {
      let allValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) {
          allValid = false;
        }
      });

      if (!allValid) {
        e.preventDefault();
        // Scroll to first error
        const firstError = contactForm.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
      }
    });
  }

  // ============================================
  // 8. WHATSAPP IMPROVED — Pulse + Tooltip
  // ============================================
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (whatsappBtn) {
    // Create tooltip
    const tooltip = document.createElement('span');
    tooltip.className = 'whatsapp-tooltip';
    tooltip.textContent = 'Besoin d\'aide ?';
    whatsappBtn.appendChild(tooltip);

    // Show tooltip on hover
    whatsappBtn.addEventListener('mouseenter', function() {
      tooltip.classList.add('show');
    });
    whatsappBtn.addEventListener('mouseleave', function() {
      tooltip.classList.remove('show');
    });

    // Auto-show tooltip after 3 seconds (if not hovered before)
    let tooltipTimeout = setTimeout(() => {
      if (!tooltip.classList.contains('show')) {
        tooltip.classList.add('show');
        setTimeout(() => {
          tooltip.classList.remove('show');
        }, 4000);
      }
    }, 3000);

    // Cancel auto-show if user interacts
    whatsappBtn.addEventListener('mouseenter', function() {
      clearTimeout(tooltipTimeout);
    });
  }

  // ============================================
  // 9. RIPPLE EFFECT ON CTA BUTTONS (CSS-driven, but we add click handler for compatibility)
  // ============================================
  document.querySelectorAll('.btn-gold, .btn-primary, .btn-outline, .btn-outline-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // CSS ripple is handled via ::after pseudo-element with animation
      // This space reserved for any JS enhancement needed
    });
  });

  // ============================================
  // 10. BACK TO TOP BUTTON (adds smooth behavior)
  // ============================================
  // If there's already a scroll-to-top mechanism, enhance it.
  // Create a subtle scroll progress indicator on the header
  if (!prefersReducedMotion) {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    });
  }

  // ============================================
  // 11. SMOOTH IMAGE LOADING — Add loaded class
  // ============================================
  document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
    }
  });

});
