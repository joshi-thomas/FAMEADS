/**
 * Fameads Creative Agency — Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initSmoothScroll();
  initContactForm();
  setActiveNavLink();
  initScrollReveal();
  initConsultationModal();
  initWhatsAppChat();
  initBackToTop();
});

/* ---- Mobile Navigation Toggle ---- */
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove('open');
    toggle.classList.remove('active');
  };

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a, [data-consultation-open]').forEach((item) => {
    item.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ---- Smooth Scrolling for Anchor Links ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '72',
          10
        );
        const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ---- Highlight Active Nav Link ---- */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---- Contact Form Validation ---- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = {
      name: { el: form.querySelector('#name'), rule: (v) => v.trim().length >= 2, msg: 'Please enter your name (at least 2 characters).' },
      phone: { el: form.querySelector('#phone'), rule: (v) => /^[\d\s\-+()]{7,15}$/.test(v.trim()), msg: 'Please enter a valid phone number.' },
      email: { el: form.querySelector('#email'), rule: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
      service: { el: form.querySelector('#service'), rule: (v) => v !== '', msg: 'Please select a type of service.' },
      message: { el: form.querySelector('#message'), rule: (v) => v.trim().length >= 10, msg: 'Please describe your project (at least 10 characters).' },
    };

    let isValid = true;

    Object.values(fields).forEach(({ el, rule, msg }) => {
      const group = el.closest('.form-group');
      const errorEl = group.querySelector('.error-msg');
      const value = el.value;

      if (!rule(value)) {
        group.classList.add('error');
        if (errorEl) errorEl.textContent = msg;
        isValid = false;
      } else {
        group.classList.remove('error');
      }
    });

    if (isValid) {
      const successEl = form.querySelector('.form-success');
      if (successEl) {
        successEl.classList.add('show');
        form.reset();
        setTimeout(() => successEl.classList.remove('show'), 5000);
      }
    }
  });

  form.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('error');
    });
  });
}

/* ---- Free Consultation Modal ---- */
function initConsultationModal() {
  const openTriggers = document.querySelectorAll('[data-consultation-open]');
  if (!openTriggers.length) return;

  const modal = document.createElement('div');
  modal.className = 'consultation-modal';
  modal.id = 'consultationModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'consultationTagline');
  modal.innerHTML = `
    <div class="consultation-modal-backdrop" data-consultation-close></div>
    <div class="consultation-modal-dialog">
      <button type="button" class="consultation-modal-close" data-consultation-close aria-label="Close consultation form">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      <img class="consultation-modal-logo" src="images/logo-new.png" alt="Fameads Logo" width="110" height="auto">
      <p class="consultation-modal-tagline" id="consultationTagline">Get A Free Consultation Today.</p>
      <div class="form-success" role="alert">
        Thank you! Your enquiry has been submitted. We'll get back to you soon.
      </div>
      <form id="consultationForm" novalidate>
        <div class="form-group">
          <label for="consultName">Name</label>
          <input type="text" id="consultName" name="name" placeholder="Your full name" required>
          <span class="error-msg"></span>
        </div>
        <div class="form-group">
          <label for="consultPhone">Phone Number</label>
          <input type="tel" id="consultPhone" name="phone" placeholder="+91 98765 43210" required>
          <span class="error-msg"></span>
        </div>
        <div class="form-group">
          <label for="consultEmail">Email Address</label>
          <input type="email" id="consultEmail" name="email" placeholder="you@example.com" required>
          <span class="error-msg"></span>
        </div>
        <div class="form-group">
          <label for="consultService">Type of Service</label>
          <select id="consultService" name="service" required>
            <option value="">Select a service</option>
            <option value="corporate-branding">Corporate Branding</option>
            <option value="web-development">Web Development</option>
            <option value="digital-marketing">Digital Marketing</option>
            <option value="graphic-designing">Graphic Designing</option>
            <option value="seo-services">SEO Services</option>
            <option value="software-development">Software Development</option>
            <option value="theater-advertisement">Theater Advertisement</option>
            <option value="other">Other</option>
          </select>
          <span class="error-msg"></span>
        </div>
        <div class="form-group">
          <label for="consultMessage">Project Details / Message</label>
          <textarea id="consultMessage" name="message" placeholder="Tell us about your project, goals, and timeline..." required></textarea>
          <span class="error-msg"></span>
        </div>
        <button type="submit" class="btn">Submit Your Enquiry</button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const form = modal.querySelector('#consultationForm');
  const successEl = modal.querySelector('.form-success');
  let lastFocus = null;

  const openModal = () => {
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    document.body.classList.add('consultation-modal-open');
    const firstField = modal.querySelector('#consultName');
    if (firstField) firstField.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('consultation-modal-open');
    if (form) {
      form.reset();
      form.querySelectorAll('.form-group.error').forEach((group) => group.classList.remove('error'));
    }
    if (successEl) successEl.classList.remove('show');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  modal.querySelectorAll('[data-consultation-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = {
      name: { el: form.querySelector('#consultName'), rule: (v) => v.trim().length >= 2, msg: 'Please enter your name (at least 2 characters).' },
      phone: { el: form.querySelector('#consultPhone'), rule: (v) => /^[\d\s\-+()]{7,15}$/.test(v.trim()), msg: 'Please enter a valid phone number.' },
      email: { el: form.querySelector('#consultEmail'), rule: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Please enter a valid email address.' },
      service: { el: form.querySelector('#consultService'), rule: (v) => v !== '', msg: 'Please select a type of service.' },
      message: { el: form.querySelector('#consultMessage'), rule: (v) => v.trim().length >= 10, msg: 'Please describe your project (at least 10 characters).' },
    };

    let isValid = true;

    Object.values(fields).forEach(({ el, rule, msg }) => {
      if (!el) return;
      const group = el.closest('.form-group');
      const errorEl = group.querySelector('.error-msg');
      const value = el.value;

      if (!rule(value)) {
        group.classList.add('error');
        if (errorEl) errorEl.textContent = msg;
        isValid = false;
      } else {
        group.classList.remove('error');
      }
    });

    if (isValid) {
      form.reset();
      if (successEl) {
        successEl.classList.add('show');
        setTimeout(() => {
          successEl.classList.remove('show');
          closeModal();
        }, 2500);
      } else {
        closeModal();
      }
    }
  });

  form.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('error');
    });
  });
}

/* ---- Floating WhatsApp Chat ---- */
function initWhatsAppChat() {
  const phone = '919876543210';
  const widget = document.createElement('div');
  widget.className = 'wa-widget';
  widget.innerHTML = `
    <div class="wa-chat" id="waChat" role="dialog" aria-label="WhatsApp chat" aria-hidden="true">
      <div class="wa-chat-header">
        <div class="wa-chat-header-info">
          <span class="wa-chat-avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </span>
          <div>
            <strong class="wa-chat-title">Fameads</strong>
            <span class="wa-chat-status">Typically replies within an hour</span>
          </div>
        </div>
        <button type="button" class="wa-chat-close" aria-label="Close WhatsApp chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="wa-chat-body">
        <div class="wa-bubble wa-bubble-in">
          <p>Hi there! 👋 Welcome to Fameads.</p>
          <p>How can we help you today? Send us a message and we'll get back to you on WhatsApp.</p>
        </div>
      </div>
      <form class="wa-chat-footer" id="waChatForm">
        <label class="visually-hidden" for="waMessage">Type a message</label>
        <input type="text" id="waMessage" class="wa-chat-input" placeholder="Type a message..." autocomplete="off" required>
        <button type="submit" class="wa-chat-send" aria-label="Send WhatsApp message">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </form>
    </div>
    <button type="button" class="wa-float" id="waFloatBtn" aria-label="Open WhatsApp chat" aria-expanded="false" aria-controls="waChat">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </button>
  `;

  document.body.appendChild(widget);

  const chat = widget.querySelector('#waChat');
  const floatBtn = widget.querySelector('#waFloatBtn');
  const closeBtn = widget.querySelector('.wa-chat-close');
  const form = widget.querySelector('#waChatForm');
  const input = widget.querySelector('#waMessage');

  const openChat = () => {
    chat.classList.add('is-open');
    chat.setAttribute('aria-hidden', 'false');
    floatBtn.setAttribute('aria-expanded', 'true');
    floatBtn.classList.add('is-active');
    setTimeout(() => input && input.focus(), 280);
  };

  const closeChat = () => {
    chat.classList.remove('is-open');
    chat.setAttribute('aria-hidden', 'true');
    floatBtn.setAttribute('aria-expanded', 'false');
    floatBtn.classList.remove('is-active');
  };

  floatBtn.addEventListener('click', () => {
    if (chat.classList.contains('is-open')) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn.addEventListener('click', closeChat);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chat.classList.contains('is-open')) {
      closeChat();
      floatBtn.focus();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    input.value = '';
    closeChat();
  });
}

/* ---- Back to Top Button ---- */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  `;
  document.body.appendChild(btn);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- Scroll Reveal for About Chronicles ---- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}
