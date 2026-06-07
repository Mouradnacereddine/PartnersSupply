/* ============================================
   PARTNERS SUPPLY — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // --- Mobile Drawer Toggle ---
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

  // --- Scroll Header Effect ---
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });

  // --- Scroll Animations (Intersection Observer) ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });
  }

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Active Navigation Link ---
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-desktop a, .mobile-drawer nav a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath && currentPath.endsWith(linkPath)) {
      link.classList.add('active');
    }
  });

  // --- Counter Animation for Stats ---
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target + (element.getAttribute('data-suffix') || '');
        clearInterval(timer);
      } else {
        element.textContent = current + (element.getAttribute('data-suffix') || '');
      }
    }, 16);
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
  }

});
