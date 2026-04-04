const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const yearEl = document.querySelector('#year');
const galleryTrack = document.querySelector('#gallery-track');
const galleryPrev = document.querySelector('#gallery-prev');
const galleryNext = document.querySelector('#gallery-next');
const galleryDotsWrap = document.querySelector('#gallery-dots');
const enquiryForm = document.querySelector('#enquiry-form');
const sendQueryBtn = document.querySelector('#send-query-btn');
const formStatus = document.querySelector('#form-status');

// Set this after deploying your worker endpoint.
const CONTACT_API_ENDPOINT = 'https://himalyan-organic-contact-api.ashwani12ksp.workers.dev/api/contact';

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('open');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (galleryTrack && galleryPrev && galleryNext && galleryDotsWrap) {
  const slides = Array.from(galleryTrack.querySelectorAll('.gallery-slide'));
  let currentIndex = 0;

  const setSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    galleryTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    galleryTrack.style.transition = 'transform 0.45s ease';

    slides.forEach((slide, idx) => {
      slide.classList.toggle('is-active', idx === currentIndex);
    });

    galleryDotsWrap.querySelectorAll('.gallery-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
      dot.setAttribute('aria-current', idx === currentIndex ? 'true' : 'false');
    });
  };

  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot';
    dot.setAttribute('aria-label', `Go to gallery image ${idx + 1}`);
    dot.addEventListener('click', () => setSlide(idx));
    galleryDotsWrap.appendChild(dot);
  });

  galleryPrev.addEventListener('click', () => setSlide(currentIndex - 1));
  galleryNext.addEventListener('click', () => setSlide(currentIndex + 1));

  setSlide(0);
}

if (enquiryForm && sendQueryBtn && formStatus) {
  const hasContactApi =
    CONTACT_API_ENDPOINT && !CONTACT_API_ENDPOINT.includes('YOUR_WORKER_SUBDOMAIN');

  enquiryForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (window.location.protocol === 'file:') {
      formStatus.textContent = 'Email sending is blocked on file:// pages. Run this site via http://localhost or deploy to GitHub Pages.';
      formStatus.className = 'form-status error';
      return;
    }

    const name = document.querySelector('#name')?.value.trim();
    const business = document.querySelector('#business')?.value.trim();
    const email = document.querySelector('#email')?.value.trim();
    const message = document.querySelector('#message')?.value.trim();
    const website = document.querySelector('#website')?.value.trim();

    if (!name || !business || !email) {
      formStatus.textContent = 'Please fill Name, Business, and Work Email.';
      formStatus.className = 'form-status error';
      return;
    }

    if (!hasContactApi) {
      formStatus.textContent = 'Configure CONTACT_API_ENDPOINT in assets/js/main.js after deploying Worker API.';
      formStatus.className = 'form-status error';
      return;
    }

    sendQueryBtn.disabled = true;
    sendQueryBtn.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(CONTACT_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          business,
          email,
          message,
          website
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      formStatus.textContent = 'Enquiry sent successfully. We will contact you soon.';
      formStatus.className = 'form-status success';
      enquiryForm.reset();
    } catch (error) {
      const isFetchFailure = error instanceof TypeError && /fetch/i.test(error.message || '');
      formStatus.textContent = isFetchFailure
        ? 'Unable to reach contact API. Check internet, Worker URL, and CORS origin settings.'
        : 'Failed to send right now. Please try again or use WhatsApp.';
      formStatus.className = 'form-status error';
      console.error('Contact API send failed:', error);
    } finally {
      sendQueryBtn.disabled = false;
      sendQueryBtn.textContent = 'Send Enquiry';
    }
  });
}
