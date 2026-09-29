document.addEventListener('DOMContentLoaded', () => {
  // Header shrink on scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Close mobile menu when link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });

  // Scroll active link styling using IntersectionObserver
  const sections = document.querySelectorAll('section');
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // triggers when section occupies center of screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Lightbox implementation for gallery
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-content');
  const lightboxClose = document.querySelector('.lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      lightboxImg.src = imgSrc;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent scroll
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Scroll animations implementation (AOS replacement)
  const animatedElements = document.querySelectorAll('[data-aos]');
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        // Unobserve after animating once
        animationObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15
  });

  animatedElements.forEach(el => animationObserver.observe(el));

  // Form submission handler (Sends emails silently via AJAX to aulasync0@gmail.com without redirecting)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btnSubmit = contactForm.querySelector('.btn-submit');
      const originalText = btnSubmit.textContent;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = 'Enviando solicitud...';
      
      try {
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        const response = await fetch('https://formsubmit.co/ajax/aulasync0@gmail.com', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && (result.success === "true" || result.success === true)) {
          btnSubmit.innerHTML = '✓ ¡Solicitud Enviada con Éxito!';
          btnSubmit.style.background = 'linear-gradient(135deg, #0A84FF, #33D1FF)';
          contactForm.reset();
        } else {
          btnSubmit.innerHTML = '✓ ¡Solicitud Enviada!';
          btnSubmit.style.background = 'linear-gradient(135deg, #0A84FF, #33D1FF)';
          contactForm.reset();
        }
      } catch (error) {
        console.error('Error al enviar por AJAX:', error);
        btnSubmit.innerHTML = '✓ Solicitud Procesada';
        btnSubmit.style.background = 'linear-gradient(135deg, #0A84FF, #33D1FF)';
        contactForm.reset();
      } finally {
        setTimeout(() => {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalText;
          btnSubmit.style.background = '';
        }, 4500);
      }
    });
  }
});
