// =========================================
// FROM THE GARDEN — Main JS
// =========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Nav scroll effect ---
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // --- Mobile menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // --- Active nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Intersection Observer for fade-up ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  // --- Email form ---
  const emailForms = document.querySelectorAll('.email-form');
  emailForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      if (input && input.value) {
        btn.textContent = 'You\'re in!';
        btn.style.background = '#5f8677';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Join';
          btn.style.background = '';
        }, 3000);
      }
    });
  });

  // --- Contact form ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Message Sent!';
      btn.style.background = '#5f8677';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

});
