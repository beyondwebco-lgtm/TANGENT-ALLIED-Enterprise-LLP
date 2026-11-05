/**
 * TANGENT ALLIED ENTERPRISE LLP
 * Main Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const header = document.querySelector('.main-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.querySelector('.back-to-top-btn');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  // --- Sticky Header Shadow on Scroll ---
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Init on load

  // --- Mobile Hamburger Menu ---
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // --- Smooth Scrolling & Close Mobile Menu on Click ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Close mobile drawer if open
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
              icon.classList.remove('fa-xmark');
              icon.classList.add('fa-bars');
            }
          }
        }

        // Calculate offset position
        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // --- Back to Top Click ---
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // --- Active Nav Link on Scroll Spy ---
  const sections = document.querySelectorAll('section[id]');
  const observeScrollSpy = () => {
    const scrollY = window.pageYOffset;
    const headerHeight = header ? header.offsetHeight + 20 : 100;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - headerHeight;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove('active'));
        if (matchingLink) {
          matchingLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', observeScrollSpy, { passive: true });

  // --- Contact Form Submission & Validation ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName').value.trim();
      const mobile = document.getElementById('mobileNumber').value.trim();
      const email = document.getElementById('emailAddress').value.trim();
      const message = document.getElementById('messageText').value.trim();

      // Basic validation checks
      if (!name || !mobile || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Mobile phone length check (at least 7 digits)
      const phoneDigits = mobile.replace(/\D/g, '');
      if (phoneDigits.length < 7) {
        showFormMessage('Please enter a valid mobile number.', 'error');
        return;
      }

      // Show immediate success response
      const successHtml = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
          <i class="fa-solid fa-circle-check" style="color: #10B981; font-size: 1.4rem; margin-top: 2px;"></i>
          <div>
            <div style="font-weight: 800; font-size: 1rem; margin-bottom: 4px;">Thank you, ${escapeHtml(name)}!</div>
            <p style="margin-bottom: 12px; font-weight: 400; color: #065F46;">Your message has been received. The TANGENT ALLIED Enterprise LLP team will get in touch with you shortly.</p>
            <a href="https://wa.me/917989395620?text=${encodeURIComponent(`Hello TANGENT ALLIED Enterprise LLP, my name is ${name}. I submitted an inquiry: "${message}" (Mobile: ${mobile}, Email: ${email})`)}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn btn-sm" 
               style="background-color: #25D366; color: white; display: inline-flex; border-radius: 6px;">
              <i class="fa-brands fa-whatsapp"></i> Also Send via WhatsApp for Instant Response
            </a>
          </div>
        </div>
      `;

      formStatus.innerHTML = successHtml;
      formStatus.className = 'form-status success';
      formStatus.style.display = 'block';

      // Reset the form fields
      contactForm.reset();

      // Scroll to message if needed
      formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  function showFormMessage(msg, type) {
    if (!formStatus) return;
    formStatus.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="margin-right: 8px;"></i> ${escapeHtml(msg)}`;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
  }
});

