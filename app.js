/**
 * WAYTONE SKILL DEVELOPMENT CENTRE
 * Official Website JavaScript Controller
 * Brand: Waytone • "The Perfect Way To Tone Your Skill"
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initStickyHeader();
  initReviewCarousel();
  initCourseSelectButtons();
  initDemoForm();
  initSchoolInquiryForm();
});

/* ==========================================================================
   1. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-nav-link');

  if (!hamburgerBtn || !mobileDrawer) return;

  hamburgerBtn.addEventListener('click', () => {
    mobileDrawer.classList.toggle('open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!mobileDrawer.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      mobileDrawer.classList.remove('open');
    }
  });
}

/* ==========================================================================
   2. STICKY HEADER & SCROLLSPY
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header background toggle
    if (scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. STUDENT REVIEWS CAROUSEL WITH TOUCH/SWIPE SUPPORT
   ========================================================================== */
function initReviewCarousel() {
  const track = document.getElementById('carousel-track');
  const viewport = document.getElementById('carousel-viewport');
  const prevBtn = document.getElementById('prev-review');
  const nextBtn = document.getElementById('next-review');
  const dotsContainer = document.getElementById('carousel-dots');

  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.review-card');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoSlideTimer = null;

  function updateCarousel(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  prevBtn.addEventListener('click', () => {
    updateCarousel(currentIndex - 1);
    restartAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    updateCarousel(currentIndex + 1);
    restartAutoSlide();
  });

  if (dotsContainer) {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateCarousel(idx);
        restartAutoSlide();
      });
    });
  }

  // Mobile Swipe Gestures
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // swipe left -> next
        updateCarousel(currentIndex + 1);
      } else {
        // swipe right -> prev
        updateCarousel(currentIndex - 1);
      }
      restartAutoSlide();
    }
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, 7000);
  }

  function restartAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  startAutoSlide();

  // Pause on hover
  viewport.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
  viewport.addEventListener('mouseleave', () => startAutoSlide());
}

/* ==========================================================================
   4. COURSE SELECT QUICK CTA
   ========================================================================== */
function initCourseSelectButtons() {
  const courseButtons = document.querySelectorAll('.course-select-btn');
  const courseDropdown = document.getElementById('demo-course');

  courseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const courseName = btn.getAttribute('data-course');
      if (courseDropdown && courseName) {
        courseDropdown.value = courseName;
      }
    });
  });
}

/* ==========================================================================
   5. CONTACT / FREE DEMO FORM
   ========================================================================== */
function initDemoForm() {
  const form = document.getElementById('demo-form');
  const successNotice = document.getElementById('demo-success');

  if (!form || !successNotice) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('demo-name').value.trim();
    const place = document.getElementById('demo-place').value.trim();
    const phone = document.getElementById('demo-phone').value.trim();
    const email = document.getElementById('demo-email').value.trim();
    const course = document.getElementById('demo-course').value;

    if (!name || !place || !phone || !course) {
      showToast('Please fill in all required fields (Name, Place, Phone, Course).');
      return;
    }

    // Save lead into localStorage for persistence
    try {
      const leads = JSON.parse(localStorage.getItem('waytone_demo_leads') || '[]');
      leads.push({
        name,
        place,
        phone,
        email,
        course,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('waytone_demo_leads', JSON.stringify(leads));
    } catch (err) {
      console.warn('Could not save lead locally:', err);
    }

    // Display clean success message
    form.style.display = 'none';
    successNotice.style.display = 'block';

    showToast(`Thank you, ${name}! Your free demo request has been received.`);
  });
}

/* ==========================================================================
   6. SCHOOL ORIENTATION INQUIRY FORM
   ========================================================================== */
function initSchoolInquiryForm() {
  const form = document.getElementById('school-inquiry-form');
  const successNotice = document.getElementById('school-success');

  if (!form || !successNotice) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const schoolName = document.getElementById('school-name')?.value.trim();
    const schoolPlace = document.getElementById('school-place')?.value.trim();
    const contactPerson = document.getElementById('contact-person')?.value.trim();
    const schoolPhone = document.getElementById('school-phone')?.value.trim();
    const studentCount = document.getElementById('student-count')?.value;
    const programFormat = document.getElementById('program-format')?.value;
    const targetGrades = document.getElementById('target-grades')?.value.trim();

    if (!schoolName || !schoolPlace || !contactPerson || !schoolPhone || !studentCount || !programFormat) {
      alert('Please fill in all required fields.');
      return;
    }

    // Save school inquiry into localStorage for persistence
    try {
      const inquiries = JSON.parse(localStorage.getItem('waytone_school_inquiries') || '[]');
      inquiries.push({
        schoolName,
        schoolPlace,
        contactPerson,
        schoolPhone,
        studentCount,
        programFormat,
        targetGrades,
        submittedAt: new Date().toISOString()
      });
      localStorage.setItem('waytone_school_inquiries', JSON.stringify(inquiries));
    } catch (err) {
      console.warn('Could not save school inquiry locally:', err);
    }

    form.style.display = 'none';
    successNotice.style.display = 'block';
  });
}

/* ==========================================================================
   TOAST HELPER
   ========================================================================== */
let toastTimeout = null;

function showToast(message) {
  const toast = document.getElementById('site-toast');
  if (!toast) return;

  toast.textContent = message;
  toast.style.display = 'block';

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}
