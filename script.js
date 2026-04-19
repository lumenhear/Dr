/**
 * DEEPAK | AUDIOLOGIST & SLP — SCRIPT.JS
 * Handles: loader, navbar, dark mode, hamburger,
 *          scroll reveal, FAQ accordion, form validation, back-to-top
 */

'use strict';

/* ── LOADER ─────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('hide'), 600);
});

/* ── DARK MODE ──────────────────────────────── */
const darkToggle = document.getElementById('darkToggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const icon = darkToggle?.querySelector('i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// Initialise from saved preference (or system preference)
(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    setTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
  }
})();

darkToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ── NAVBAR SCROLL STATE ────────────────────── */
const navbar = document.getElementById('navbar');

function handleNavScroll() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ── HAMBURGER / MOBILE MENU ────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  // Prevent body scroll when menu open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (
    navLinks?.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger?.contains(e.target)
  ) {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('active');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ── SMOOTH SCROLL for anchor links ─────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── SCROLL REVEAL ──────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ── FAQ ACCORDION ──────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const answer = btn.nextElementSibling;

    // Collapse all others
    document.querySelectorAll('.faq-question').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.style.maxHeight = null;
      }
    });

    // Toggle clicked
    if (isExpanded) {
      btn.setAttribute('aria-expanded', 'false');
      answer.style.maxHeight = null;
    } else {
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ── CONTACT FORM VALIDATION ────────────────── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

function getField(id) { return document.getElementById(id); }
function getError(id) { return document.getElementById(id + 'Error'); }

function showError(fieldId, message) {
  const field = getField(fieldId);
  const error = getError(fieldId);
  if (field)  field.classList.add('error');
  if (error) { error.textContent = message; error.classList.add('visible'); }
}

function clearError(fieldId) {
  const field = getField(fieldId);
  const error = getError(fieldId);
  if (field)  field.classList.remove('error');
  if (error) { error.textContent = ''; error.classList.remove('visible'); }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
  return /^\d{7,15}$/.test(cleaned);
}

// Live validation on blur
['name', 'phone', 'email', 'service'].forEach(id => {
  getField(id)?.addEventListener('blur', () => validateField(id));
  getField(id)?.addEventListener('input', () => clearError(id));
});

function validateField(id) {
  const value = (getField(id)?.value || '').trim();
  clearError(id);

  if (id === 'name') {
    if (!value) { showError('name', 'Please enter your full name.'); return false; }
    if (value.length < 2) { showError('name', 'Name must be at least 2 characters.'); return false; }
  }
  if (id === 'phone') {
    if (!value) { showError('phone', 'Please enter your phone number.'); return false; }
    if (!validatePhone(value)) { showError('phone', 'Please enter a valid phone number.'); return false; }
  }
  if (id === 'email' && value) {
    if (!validateEmail(value)) { showError('email', 'Please enter a valid email address.'); return false; }
  }
  if (id === 'service') {
    if (!value) { showError('service', 'Please select a service.'); return false; }
  }
  return true;
}

form?.addEventListener('submit', e => {
  e.preventDefault();

  // Validate required fields
  const nameOk    = validateField('name');
  const phoneOk   = validateField('phone');
  const serviceOk = validateField('service');

  // Validate email only if provided
  let emailOk = true;
  const emailVal = (getField('email')?.value || '').trim();
  if (emailVal && !validateEmail(emailVal)) {
    showError('email', 'Please enter a valid email address.');
    emailOk = false;
  }

  if (!nameOk || !phoneOk || !serviceOk || !emailOk) return;

  // Simulate submission
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Enquiry';
    form.reset();
    formSuccess.textContent = '✓ Thank you! Your enquiry has been received. Deepak will get back to you within a few hours.';
    formSuccess.classList.add('visible');
    setTimeout(() => formSuccess.classList.remove('visible'), 8000);
  }, 1800);
});

/* ── BACK TO TOP ────────────────────────────── */
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  backTop?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── FOOTER YEAR ────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── ACTIVE NAV LINK on scroll ──────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.style.color = '';
          link.style.background = '';
        });
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) {
          active.style.color = 'var(--accent)';
          active.style.background = 'var(--accent-light)';
        }
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(section => sectionObserver.observe(section));

/* ── REDUCED MOTION support ─────────────────── */
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mediaQuery.matches) {
  document.documentElement.style.setProperty('--transition', '0s');
  document.documentElement.style.setProperty('--transition-slow', '0s');
}

