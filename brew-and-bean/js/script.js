/* =========================================================
   BREW & BEAN CAFÉ — SCRIPT.JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------
     1 & 2. MOBILE HAMBURGER NAVIGATION (open / close)
  --------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function closeMobileMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  /* 3. Close mobile nav after a link is selected */
  const allNavLinks = document.querySelectorAll('.nav-link');
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileMenu();
    });
  });

  /* Close the mobile menu if the viewport is resized back to desktop */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  /* ---------------------------------------------------------
     4 & 5. MENU CATEGORY FILTERING + ACTIVE FILTER STATE
  --------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const selectedCategory = button.getAttribute('data-filter');

      /* Update active button state */
      filterButtons.forEach(function (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      /* Show or hide matching products without reloading the page */
      menuItems.forEach(function (item) {
        const itemCategory = item.getAttribute('data-category');
        const matches = selectedCategory === 'all' || itemCategory === selectedCategory;
        item.classList.toggle('hidden', !matches);
      });
    });
  });

  /* ---------------------------------------------------------
     6 & 7. CONTACT FORM VALIDATION + SUCCESS MESSAGE
  --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const fullNameError = document.getElementById('fullNameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  const MIN_MESSAGE_LENGTH = 10;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(inputEl, errorEl, message) {
    const group = inputEl.closest('.form-group');
    if (message) {
      group.classList.add('has-error');
      errorEl.textContent = message;
    } else {
      group.classList.remove('has-error');
      errorEl.textContent = '';
    }
  }

  function validateForm() {
    let isValid = true;

    /* Full name required */
    if (fullNameInput.value.trim() === '') {
      setFieldError(fullNameInput, fullNameError, 'Please enter your full name.');
      isValid = false;
    } else {
      setFieldError(fullNameInput, fullNameError, '');
    }

    /* Email required + valid format */
    if (emailInput.value.trim() === '') {
      setFieldError(emailInput, emailError, 'Please enter your email address.');
      isValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      setFieldError(emailInput, emailError, 'Please enter a valid email address.');
      isValid = false;
    } else {
      setFieldError(emailInput, emailError, '');
    }

    /* Subject required */
    if (subjectInput.value.trim() === '') {
      setFieldError(subjectInput, subjectError, 'Please enter a subject.');
      isValid = false;
    } else {
      setFieldError(subjectInput, subjectError, '');
    }

    /* Message required + minimum length */
    const messageValue = messageInput.value.trim();
    if (messageValue === '') {
      setFieldError(messageInput, messageError, 'Please enter a message.');
      isValid = false;
    } else if (messageValue.length < MIN_MESSAGE_LENGTH) {
      setFieldError(messageInput, messageError, 'Your message is too short (minimum ' + MIN_MESSAGE_LENGTH + ' characters).');
      isValid = false;
    } else {
      setFieldError(messageInput, messageError, '');
    }

    return isValid;
  }

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault(); /* Prevent page reload / backend submission */

    const isValid = validateForm();

    if (isValid) {
      formSuccess.classList.add('visible');
      contactForm.reset();

      /* Hide the success message again after a while */
      setTimeout(function () {
        formSuccess.classList.remove('visible');
      }, 5000);
    } else {
      formSuccess.classList.remove('visible');
    }
  });

  /* Clear an individual field's error as the user corrects it */
  [fullNameInput, emailInput, subjectInput, messageInput].forEach(function (input) {
    input.addEventListener('input', function () {
      const group = input.closest('.form-group');
      if (group.classList.contains('has-error')) {
        validateForm();
      }
    });
  });

  /* ---------------------------------------------------------
     8 & 9. SCROLL-TO-TOP BUTTON (show/hide + click behaviour)
  --------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const SCROLL_SHOW_THRESHOLD = 400;

  function toggleScrollTopButton() {
    if (window.scrollY > SCROLL_SHOW_THRESHOLD) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     10. ACTIVE NAVIGATION LINK WHILE SCROLLING
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const header = document.getElementById('header');

  function updateActiveNavLink() {
    const headerHeight = header.offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 40;

    let currentSectionId = sections.length ? sections[0].id : '';

    sections.forEach(function (section) {
      if (scrollPosition >= section.offsetTop) {
        currentSectionId = section.id;
      }
    });

    allNavLinks.forEach(function (link) {
      const linkTarget = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active-link', linkTarget === currentSectionId);
    });
  }

  /* Combine scroll-driven behaviours into a single listener */
  window.addEventListener('scroll', function () {
    toggleScrollTopButton();
    updateActiveNavLink();
  });

  /* Run once on load in case the page is refreshed mid-scroll */
  toggleScrollTopButton();
  updateActiveNavLink();

});
