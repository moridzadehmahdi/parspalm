// انتخاب عناصر
const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('.main-menu');
const body = document.querySelector('body');
const scrollBtns = document.querySelectorAll('.scroll-btn');
const dailyTimer = document.getElementById('daily-timer');

// کلیک روی دکمه همبرگری
menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  mainMenu.classList.toggle('active');
  
  // تغییر آیکون دکمه
  if (mainMenu.classList.contains('active')) {
    menuToggle.querySelector('.menu-icon').textContent = '✖';
    body.classList.add('menu-open');
  } else {
    menuToggle.querySelector('.menu-icon').textContent = '☰';
    body.classList.remove('menu-open');
  }
});

// کلیک بیرون منو => بستن منو
document.addEventListener('click', (event) => {
  if (mainMenu.classList.contains('active') && 
      !mainMenu.contains(event.target) && 
      !menuToggle.contains(event.target)) {
    mainMenu.classList.remove('active');
    menuToggle.querySelector('.menu-icon').textContent = '☰';
    body.classList.remove('menu-open');
  }
});

// جلوگیری از بستن منو هنگام کلیک روی خود منو
mainMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});

// اسکرول محصولات با دکمه‌ها
scrollBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const isLeft = btn.classList.contains('left-scroll');
    const container = btn.closest('.products-container');
    const scrollElement = container.querySelector('.products-scroll');
    
    const scrollAmount = 300;
    scrollElement.scrollBy({
      left: isLeft ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  });
});

// تایمر پیشنهاد روز
function updateDailyTimer() {
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  const diff = endOfDay - now;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  dailyTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// به روز رسانی تایمر هر ثانیه
setInterval(updateDailyTimer, 1000);
updateDailyTimer();

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
  });
  
  scroll.addEventListener('mouseleave', () => {
    isDown = false;
  });
  
  scroll.addEventListener('mouseup', () => {
    isDown = false;
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