/**
 * Abdallah El Tarabishi (الطرابيشي لابتوب) - Official Client Script
 * Handles navigation, interactive lightbox gallery, copy-to-clipboard, and UX helpers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isOpen = navLinks.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = '☰';
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '☰';
      });
    });
  }

  // 2. Active Link Highlighter
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 3. Copy Phone Number with Toast Notification
  const copyButtons = document.querySelectorAll('.copy-phone-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const phone = btn.getAttribute('data-phone') || '+201112790784';
      navigator.clipboard.writeText(phone).then(() => {
        showToast('✅ تم نسخ الرقم بنجاح: ' + phone);
      }).catch(() => {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = phone;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('✅ تم نسخ الرقم بنجاح: ' + phone);
      });
    });
  });

  // 4. Toast Notification Element
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // 5. Gallery Lightbox Functionality
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    let currentIdx = 0;
    const imagesList = Array.from(galleryItems).map(item => {
      const img = item.querySelector('img');
      return {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || 'صورة من أعمال الطرابيشي'
      };
    });

    // Create lightbox DOM elements if not already present
    let lightbox = document.querySelector('.lightbox-modal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox-modal';
      lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="إغلاق">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="السابق">&#10095;</button>
        <div class="lightbox-content">
          <img src="" alt="" class="lightbox-img" />
          <div class="lightbox-caption"></div>
        </div>
        <button class="lightbox-nav lightbox-next" aria-label="التالي">&#10094;</button>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    function openLightbox(index) {
      currentIdx = index;
      updateLightbox();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightbox() {
      const item = imagesList[currentIdx];
      lightboxImg.src = item.src;
      lightboxCaption.textContent = `${item.alt} (${currentIdx + 1} من ${imagesList.length})`;
    }

    function showNext() {
      currentIdx = (currentIdx + 1) % imagesList.length;
      updateLightbox();
    }

    function showPrev() {
      currentIdx = (currentIdx - 1 + imagesList.length) % imagesList.length;
      updateLightbox();
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showNext();
      if (e.key === 'ArrowRight') showPrev();
    });
  }

  // 6. Stop other videos when one plays
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.addEventListener('play', () => {
      videos.forEach(otherVideo => {
        if (otherVideo !== video && !otherVideo.paused) {
          otherVideo.pause();
        }
      });
    });
  });

  // 7. Gallery Category Filter (if filters exist)
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category') || 'all';
          if (filter === 'all' || category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
});

