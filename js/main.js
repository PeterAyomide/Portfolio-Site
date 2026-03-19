/* ============================================================
   PORTFOLIO – JAVASCRIPT
   Author: Peter Adegboye
   ============================================================ */

'use strict';

// ── Font Awesome CDN fallback ────────────────────────────────
// If the primary CDN fails to load FA, attempt a secondary source
(function () {
  var testIcon = document.createElement('span');
  testIcon.className = 'fas fa-check';
  testIcon.style.cssText = 'position:absolute;visibility:hidden';
  document.body.appendChild(testIcon);
  var computed = window.getComputedStyle(testIcon, ':before');
  var faLoaded = computed && computed.fontFamily && computed.fontFamily.includes('Font Awesome');
  document.body.removeChild(testIcon);

  if (!faLoaded) {
    var fallback = document.createElement('link');
    fallback.rel = 'stylesheet';
    fallback.href = 'https://use.fontawesome.com/releases/v6.5.1/css/all.css';
    document.head.appendChild(fallback);
  }
})();

// ── Navbar: scroll class & active link highlighting ──────────
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.navbar__links a');
const sections = document.querySelectorAll('main section[id]');

function onScroll() {
  // Sticky navbar style
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back-to-top button visibility
  const backToTop = document.getElementById('back-to-top');
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active nav link based on current section
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── Mobile nav toggle ────────────────────────────────────────
const navToggle   = document.getElementById('nav-toggle');
const navLinkList = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.classList.toggle('open');
  navLinkList.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav when a link is clicked
navLinkList.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinkList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ── Back to top ──────────────────────────────────────────────
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Reveal on scroll (IntersectionObserver) ──────────────────
const revealElements = document.querySelectorAll(
  '.skill-card, .project-card, .about__inner, .contact__inner, .section__title'
);

revealElements.forEach((el) => {
  el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ── Contact form validation & submission ─────────────────────
const contactForm = document.getElementById('contact-form');

function getField(id) {
  return document.getElementById(id);
}

function showError(fieldId, message) {
  const field = getField(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  field.classList.add('error');
  error.textContent = message;
}

function clearError(fieldId) {
  const field = getField(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  field.classList.remove('error');
  error.textContent = '';
}

function validateEmail(email) {
  // Use the browser's built-in email validation via a temporary input element
  const input = document.createElement('input');
  input.type = 'email';
  input.value = email;
  return input.validity.valid;
}

function validateForm() {
  let valid = true;

  const name    = getField('name').value.trim();
  const email   = getField('email').value.trim();
  const message = getField('message').value.trim();

  clearError('name');
  clearError('email');
  clearError('message');

  if (!name) {
    showError('name', 'Please enter your name.');
    valid = false;
  }

  if (!email) {
    showError('email', 'Please enter your email.');
    valid = false;
  } else if (!validateEmail(email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!message) {
    showError('message', 'Please enter a message.');
    valid = false;
  } else if (message.length < 10) {
    showError('message', 'Message must be at least 10 characters.');
    valid = false;
  }

  return valid;
}

// Clear individual field errors on input
['name', 'email', 'message'].forEach((id) => {
  getField(id).addEventListener('input', () => clearError(id));
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const successMsg = document.getElementById('form-success');
  successMsg.textContent = '';

  if (!validateForm()) return;

  // Simulate async form submission (replace with real endpoint)
  const submitBtn = contactForm.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    contactForm.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    successMsg.textContent = '\u2705 Message sent! I\u2019ll get back to you soon.';

    setTimeout(() => { successMsg.textContent = ''; }, 6000);
  }, 1200);
});

// ── Footer year ──────────────────────────────────────────────
document.getElementById('footer-year').textContent = new Date().getFullYear();
