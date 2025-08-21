// انتخاب عناصر
const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('.main-menu');
const body = document.querySelector('body');

// کلیک روی دکمه همبرگری
menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  mainMenu.classList.toggle('active');
  
  // تغییر آیکون دکمه
  if (mainMenu.classList.contains('active')) {
    menuToggle.textContent = '✖';
    body.classList.add('menu-open');
  } else {
    menuToggle.textContent = '☰';
    body.classList.remove('menu-open');
  }
});

// کلیک بیرون منو => بستن منو
document.addEventListener('click', (event) => {
  if (mainMenu.classList.contains('active') && 
      !mainMenu.contains(event.target) && 
      !menuToggle.contains(event.target)) {
    mainMenu.classList.remove('active');
    menuToggle.textContent = '☰';
    body.classList.remove('menu-open');
  }
});

// جلوگیری از بستن منو هنگام کلیک روی خود منو
mainMenu.addEventListener('click', (e) => {
  e.stopPropagation();
});