// انتخاب عناصر
const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('.main-menu');
const body = document.querySelector('body');
const menuOverlay = document.querySelector('.menu-overlay');
const menuCloseBtn = document.querySelector('.menu-close');
const scrollBtns = document.querySelectorAll('.scroll-btn');
const dailyTimer = document.getElementById('daily-timer');

// بررسی وجود عناصر مورد نیاز
if (menuToggle && mainMenu) {
  // باز کردن منو
  function openMenu() {
    mainMenu.classList.add('active');
    if (menuOverlay) menuOverlay.classList.add('active');
    body.style.overflow = 'hidden';
    const menuIcon = menuToggle.querySelector('.menu-icon');
    if (menuIcon) menuIcon.textContent = '✖';
  }

  // بستن منو
  function closeMenu() {
    mainMenu.classList.remove('active');
    if (menuOverlay) menuOverlay.classList.remove('active');
    body.style.overflow = '';
    const menuIcon = menuToggle.querySelector('.menu-icon');
    if (menuIcon) menuIcon.textContent = '☰';
    
    // بستن تمام زیرمنوها
    const menuItems = document.querySelectorAll('.menu-item.has-children');
    menuItems.forEach(item => {
      item.classList.remove('active');
    });
  }

  // کلیک روی دکمه منو
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mainMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // کلیک روی دکمه بستن
  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeMenu);
  }

  // کلیک روی overlay
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  // مدیریت زیرمنوها
  const menuItems = document.querySelectorAll('.menu-item.has-children');
  if (menuItems.length > 0) {
    menuItems.forEach(item => {
      const menuLink = item.querySelector('.menu-link');
      
      if (menuLink) {
        menuLink.addEventListener('click', function(e) {
          e.stopPropagation();
          
          // اگر این آیتم قبلا فعال بوده، ببندش
          if (item.classList.contains('active')) {
            item.classList.remove('active');
          } else {
            // اول همه زیرمنوها را ببند
            menuItems.forEach(i => {
              i.classList.remove('active');
            });
            
            // سپس این را باز کن
            item.classList.add('active');
          }
        });
      }
    });
  }

  // بستن منو با کلید ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mainMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

// به روزرسانی تعداد سبد خرید
function updateCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
      element.textContent = totalItems;
    });
  } catch (error) {
    console.error('خطا در به روزرسانی تعداد سبد خرید:', error);
  }
}

// به روزرسانی هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  
  // مدیریت اسکرول محصولات
  if (scrollBtns.length > 0) {
    scrollBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isLeft = btn.classList.contains('left-scroll');
        const container = btn.closest('.products-container');
        if (!container) return;
        
        const scrollElement = container.querySelector('.products-scroll');
        if (!scrollElement) return;
        
        const scrollAmount = scrollElement.offsetWidth * 0.8;
        scrollElement.scrollBy({
          left: isLeft ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      });
    });
  }
  
  // تایمر پیشنهاد روز
  if (dailyTimer) {
    function updateDailyTimer() {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay - now;
      
      // اگر زمان به پایان رسیده باشد، تایمر را ریست کنید
      if (diff <= 0) {
        dailyTimer.textContent = "00:00:00";
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      dailyTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    setInterval(updateDailyTimer, 1000);
    updateDailyTimer();
  }
  
  // کشیدن برای اسکرول (در دستگاه‌های لمسی)
  const productScrolls = document.querySelectorAll('.products-scroll');
  
  productScrolls.forEach(scroll => {
    let isDown = false;
    let startX;
    let scrollLeft;
    
    scroll.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - scroll.offsetLeft;
      scrollLeft = scroll.scrollLeft;
      scroll.style.cursor = 'grabbing';
    });
    
    scroll.addEventListener('mouseleave', () => {
      isDown = false;
      scroll.style.cursor = 'grab';
    });
    
    scroll.addEventListener('mouseup', () => {
      isDown = false;
      scroll.style.cursor = 'grab';
    });
    
    scroll.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scroll.offsetLeft;
      const walk = (x - startX) * 2;
      scroll.scrollLeft = scrollLeft - walk;
    });
    
    // برای دستگاه‌های لمسی
    scroll.addEventListener('touchstart', (e) => {
      isDown = true;
      startX = e.touches[0].pageX - scroll.offsetLeft;
      scrollLeft = scroll.scrollLeft;
    });
    
    scroll.addEventListener('touchend', () => {
      isDown = false;
    });
    
    scroll.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - scroll.offsetLeft;
      const walk = (x - startX) * 2;
      scroll.scrollLeft = scrollLeft - walk;
    });
  });
  
  // لودینگ تصاویر با تاخیر
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.src;
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
});

// بهبود عملکرد در resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // به روزرسانی layout پس از اتمام resize
    updateCartCount();
  }, 250);
});