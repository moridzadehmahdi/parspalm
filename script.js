// script.js - هسته مشترک سایت ParsPalm
// شامل: دیتای محصولات + UI عمومی (theme/menu/scroll/timer/search/cartCount) + image fallback exports

(() => {
  // -------------------- Products --------------------
  const PARSPALM_PRODUCTS = [
    {
      id: 1,
      name: 'خرما پیارم ویژه',
      price: 145000,
      oldPrice: 180000,
      image: 'assets/images/offer1.jpg',
      gallery: [
        'assets/images/products/piarom-1.jpg',
        'assets/images/products/piarom-2.jpg',
        'assets/images/products/piarom-3.jpg',
        'assets/images/products/piarom-4.jpg'
      ],
      category: 'dates',
      description: 'خرما پیارم ویژه با بافت نرم و طعم اصیل هرمزگان، مناسب پذیرایی و مصرف روزانه.'
    },
    {
      id: 2,
      name: 'عسل کوهی خالص',
      price: 185000,
      oldPrice: 220000,
      image: 'assets/images/offer2.jpg',
      gallery: ['assets/images/offer2.jpg'],
      category: 'honey',
      description: 'عسل کوهی خالص با طعمی عمیق و ارزش غذایی بالا، تهیه شده از مراتع بکر.'
    },
    {
      id: 3,
      name: 'حلوا ارده اعلا',
      price: 68000,
      oldPrice: 85000,
      image: 'assets/images/offer3.jpg',
      gallery: ['assets/images/offer3.jpg'],
      category: 'derivatives',
      description: 'حلوا ارده اعلا با بافت لطیف و طعم سنتی، انتخابی عالی برای میان وعده.'
    },
    {
      id: 4,
      name: 'گردوی تازه محلی',
      price: 95000,
      oldPrice: 120000,
      image: 'assets/images/offer4.jpg',
      gallery: ['assets/images/offer4.jpg'],
      category: 'nuts',
      description: 'گردوی تازه محلی با مغز درشت و روغن طبیعی، مناسب مصرف روزانه.'
    },
    {
      id: 5,
      name: 'خرما پیارم ممتاز',
      price: 150000,
      image: 'assets/images/product1.jpg',
      gallery: [
        'assets/images/products/piarom-1.jpg',
        'assets/images/products/piarom-2.jpg',
        'assets/images/products/piarom-3.jpg',
        'assets/images/products/piarom-4.jpg'
      ],
      category: 'dates',
      description: 'خرما پیارم ممتاز با بافت نرم و کیفیت صادراتی، انتخابی عالی برای هدیه.'
    },
    { id: 6, name: 'خرما کبکاب تازه', price: 120000, image: 'assets/images/product2.jpg', category: 'dates', description: 'خرما کبکاب تازه با طعم شیرین و ماندگاری بالا.' },
    { id: 7, name: 'خرما شاهانی شیراز', price: 130000, image: 'assets/images/product3.jpg', category: 'dates', description: 'خرما شاهانی شیراز با طعم ملایم و بافت گوشتی.' },
    { id: 8, name: 'گرده نخل تازه', price: 95000, image: 'assets/images/product6.jpg', category: 'dates', description: 'گرده نخل طبیعی با خواص تغذیه ای بالا.' },
    { id: 9, name: 'خرمای زاهدی', price: 110000, image: 'assets/images/product7.jpg', category: 'dates', description: 'خرمای زاهدی مرغوب با طعم متعادل و بافت نیمه خشک.' },
    { id: 10, name: 'عسل طبیعی گون', price: 140000, image: 'assets/images/product4.jpg', category: 'honey', description: 'عسل طبیعی گون با عطر گیاهی و کیفیت ممتاز.' },
    { id: 11, name: 'حلوا ارده ممتاز', price: 160000, image: 'assets/images/product5.jpg', category: 'derivatives', description: 'حلوا ارده ممتاز با طعمی غنی و بافت نرم.' },
    { id: 12, name: 'خرما خاصویی', price: 95000, oldPrice: 110000, image: 'assets/images/discount1.jpg', category: 'dates', description: 'خرما خاصویی شیرین و مغذی با تخفیف ویژه.' },
    { id: 13, name: 'خرما پیارم درجه یک', price: 160000, oldPrice: 180000, image: 'assets/images/discount2.jpg', category: 'dates', description: 'خرما پیارم صادراتی با کیفیت عالی.' },
    { id: 14, name: 'خرما کبکاب', price: 120000, oldPrice: 140000, image: 'assets/images/discount3.jpg', category: 'dates', description: 'خرما کبکاب بوشهر با طعمی اصیل.' },
    { id: 15, name: 'عسل طبیعی کنار', price: 170000, oldPrice: 200000, image: 'assets/images/discount4.jpg', category: 'honey', description: 'عسل کنار خالص با خواص درمانی.' },
    { id: 16, name: 'پسته رفسنجان', price: 125000, oldPrice: 150000, image: 'assets/images/discount5.jpg', category: 'nuts', description: 'پسته رفسنجان درجه یک با مغز خندان.' },
    { id: 17, name: 'خرما شاهانی', price: 135000, image: 'assets/images/best1.jpg', category: 'dates', description: 'خرما شاهانی محبوب با کیفیت عالی.' },
    { id: 18, name: 'خرما پیارم ممتاز', price: 150000, image: 'assets/images/best2.jpg', category: 'dates', description: 'خرما پیارم ممتاز صادراتی.' },
    { id: 19, name: 'خرما خاصویی', price: 95000, image: 'assets/images/best3.jpg', category: 'dates', description: 'خرما خاصویی محبوب جنوب با طعم شیرین.' },
    { id: 20, name: 'ارده خالص', price: 110000, image: 'assets/images/best4.jpg', category: 'derivatives', description: 'ارده طبیعی بدون افزودنی.' },
    { id: 21, name: 'شیره خرما', price: 145000, image: 'assets/images/best5.jpg', category: 'derivatives', description: 'شیره خرما طبیعی و خالص.' },
    { id: 22, name: 'خرما پیارم', price: 150000, image: 'assets/images/date1.jpg', category: 'dates', description: 'خرما پیارم مرغوب جنوب ایران.' },
    { id: 23, name: 'خرما خاصویی', price: 95000, image: 'assets/images/date2.jpg', category: 'dates', description: 'خرما خاصویی شیرین و محبوب.' },
    { id: 24, name: 'خرما کبکاب', price: 120000, image: 'assets/images/date6.jpg', category: 'dates', description: 'خرما کبکاب تازه و مرغوب.' },
    { id: 25, name: 'خرما شاهانی', price: 140000, image: 'assets/images/date7.jpg', category: 'dates', description: 'خرما شاهانی شیراز با طعم ملایم.' },
    { id: 26, name: 'خرما هلیله', price: 160000, image: 'assets/images/date8.jpg', category: 'dates', description: 'خرما هلیله خوش طعم با بافت لطیف.' },
    { id: 27, name: 'لواشک انار', price: 30000, image: 'assets/images/lavashak1.jpg', category: 'fruit-roll', description: 'لواشک انار ترش و خوشمزه.' },
    { id: 28, name: 'لواشک زردآلو', price: 28000, image: 'assets/images/lavashak2.jpg', category: 'fruit-roll', description: 'لواشک زردآلو نرم و شیرین.' },
    { id: 29, name: 'لواشک آلوچه', price: 25000, image: 'assets/images/lavashak3.jpg', category: 'fruit-roll', description: 'لواشک آلوچه ترش مزه با کیفیت عالی.' },
    { id: 30, name: 'لواشک تمشک', price: 32000, image: 'assets/images/lavashak4.jpg', category: 'fruit-roll', description: 'لواشک تمشک با طعم خاص.' },
    { id: 31, name: 'لواشک مخلوط', price: 35000, image: 'assets/images/lavashak5.jpg', category: 'fruit-roll', description: 'ترکیب چند طعم محبوب در یک بسته.' },
    { id: 32, name: 'حلوا خرما', price: 70000, image: 'assets/images/halva.jpg', category: 'derivatives', description: 'حلوا خرما مقوی و سنتی.' },
    { id: 33, name: 'شیره خرما', price: 55000, image: 'assets/images/shire-kharma.jpg', category: 'derivatives', description: 'شیره خرما طبیعی و خالص.' },
    { id: 34, name: 'شیره انگور', price: 60000, image: 'assets/images/shire-angoor.jpg', category: 'derivatives', description: 'شیره انگور مرغوب با طعم اصیل.' },
    { id: 35, name: 'سه شیره', price: 75000, image: 'assets/images/se-shire.jpg', category: 'derivatives', description: 'مخلوط سه شیره طبیعی و انرژی زا.' },
    { id: 36, name: 'حلوا ارده', price: 65000, image: 'assets/images/halva-arde.jpg', category: 'derivatives', description: 'حلوا ارده اعلا با بافت نرم.' },
    { id: 37, name: 'کیک خرما', price: 45000, image: 'assets/images/cake.jpg', category: 'sweets', description: 'کیک خرما تازه و خوش طعم.' },
    { id: 38, name: 'خرما روغنی', price: 85000, image: 'assets/images/kharma-roghani.jpg', category: 'dates', description: 'خرما روغنی تازه و مرغوب.' },
    { id: 39, name: 'رولت خرما', price: 50000, image: 'assets/images/rollet-kharma.jpg', category: 'sweets', description: 'رولت خرما با طعمی بی نظیر.' },
    { id: 40, name: 'خرما نارگیلی', price: 70000, image: 'assets/images/kharma-nargili.jpg', category: 'sweets', description: 'خرما با پوشش نارگیل.' },
    { id: 41, name: 'چیپس خرما', price: 40000, image: 'assets/images/chips-kharma.jpg', category: 'sweets', description: 'چیپس خرما ترد و خوشمزه.' }
  ];

  const DEFAULT_WEIGHTS = [
    { value: '500g', label: '500 گرم', multiplier: 1 },
    { value: '1kg', label: '1 کیلوگرم', multiplier: 1.85 },
    { value: '2kg', label: '2 کیلوگرم', multiplier: 3.4 }
  ];

  // -------------------- Image fallback (global) --------------------
  window.PARSPALM_PLACEHOLDER_IMG = 'assets/images/products/placeholder.jpg';

  window.getSafeImage = function (src) {
    if (!src || typeof src !== 'string') return window.PARSPALM_PLACEHOLDER_IMG;
    const s = src.trim();
    return s ? s : window.PARSPALM_PLACEHOLDER_IMG;
  };

  window.applyImgFallback = function (imgEl) {
    if (!imgEl) return;
    imgEl.addEventListener(
      'error',
      () => {
        imgEl.src = window.PARSPALM_PLACEHOLDER_IMG;
      },
      { once: true }
    );
  };

  window.normalizeProductImages = function () {
    if (!window.PARSPALM_PRODUCTS) return;
    window.PARSPALM_PRODUCTS.forEach((p) => {
      p.image = window.getSafeImage(p.image);
      if (Array.isArray(p.gallery) && p.gallery.length) {
        p.gallery = p.gallery.map(window.getSafeImage);
      } else {
        p.gallery = [];
      }
    });
  };

  // -------------------- Core helpers (global) --------------------
  const PARSPALM_FORMAT_PRICE = (price) => {
    try {
      return new Intl.NumberFormat('fa-IR').format(price);
    } catch {
      return String(price);
    }
  };

  const PARSPALM_GET_PRODUCT = (id) => PARSPALM_PRODUCTS.find((p) => p.id === Number(id));

  const PARSPALM_GET_WEIGHT_OPTIONS = (basePrice) =>
    DEFAULT_WEIGHTS.map((w) => ({
      ...w,
      price: Math.round(Number(basePrice || 0) * w.multiplier)
    }));

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
      document.querySelectorAll('.cart-count').forEach((el) => {
        el.textContent = totalItems;
      });
    } catch (error) {
      console.error('خطا در به روزرسانی تعداد سبد خرید:', error);
    }
  };

  // -------------------- UI logic (page-safe) --------------------
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      const icon = button.querySelector('i');
      if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      button.setAttribute('aria-label', theme === 'dark' ? 'حالت روشن' : 'حالت تیره');
    });
  };

  const initThemeToggle = () => {
    const buttons = document.querySelectorAll('.theme-toggle');
    if (!buttons.length) return;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        applyTheme(next);
      });
    });
  };

  const initMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    const body = document.body;
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuCloseBtn = document.querySelector('.menu-close');

    if (!menuToggle || !mainMenu) return;

    const openMenu = () => {
      mainMenu.classList.add('active');
      if (menuOverlay) menuOverlay.classList.add('active');
      body.style.overflow = 'hidden';
      const icon = menuToggle.querySelector('.menu-icon');
      if (icon) icon.textContent = '✖';
    };

    const closeMenu = () => {
      mainMenu.classList.remove('active');
      if (menuOverlay) menuOverlay.classList.remove('active');
      body.style.overflow = '';
      const icon = menuToggle.querySelector('.menu-icon');
      if (icon) icon.textContent = '☰';

      document.querySelectorAll('.menu-item.has-children').forEach((item) => item.classList.remove('active'));
    };

    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      mainMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    const menuItems = document.querySelectorAll('.menu-item.has-children');
    menuItems.forEach((item) => {
      const menuLink = item.querySelector('.menu-link');
      if (!menuLink) return;

      menuLink.addEventListener('click', (event) => {
        event.stopPropagation();
        if (item.classList.contains('active')) {
          item.classList.remove('active');
          return;
        }
        menuItems.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mainMenu.classList.contains('active')) closeMenu();
    });
  };

  const initScrollButtons = () => {
    const scrollBtns = document.querySelectorAll('.scroll-btn');
    if (!scrollBtns.length) return;

    scrollBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const isLeft = btn.classList.contains('left-scroll');
        const container = btn.closest('.products-container');
        const scrollElement = container ? container.querySelector('.products-scroll') : null;
        if (!scrollElement) return;

        const scrollAmount = scrollElement.offsetWidth * 0.8;
        scrollElement.scrollBy({
          left: isLeft ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      });
    });
  };

  const initDailyTimer = () => {
    const dailyTimer = document.getElementById('daily-timer');
    if (!dailyTimer) return;

    const update = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay - now;
      if (diff <= 0) {
        dailyTimer.textContent = '00:00:00';
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      dailyTimer.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    update();
    setInterval(update, 1000);
  };

  const initDragScroll = () => {
    const productScrolls = document.querySelectorAll('.products-scroll');
    if (!productScrolls.length) return;

    productScrolls.forEach((scroll) => {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      scroll.addEventListener('mousedown', (event) => {
        isDown = true;
        startX = event.pageX - scroll.offsetLeft;
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

      scroll.addEventListener('mousemove', (event) => {
        if (!isDown) return;
        event.preventDefault();
        const x = event.pageX - scroll.offsetLeft;
        const walk = (x - startX) * 2;
        scroll.scrollLeft = scrollLeft - walk;
      });

      scroll.addEventListener('touchstart', (event) => {
        isDown = true;
        startX = event.touches[0].pageX - scroll.offsetLeft;
        scrollLeft = scroll.scrollLeft;
      });

      scroll.addEventListener('touchend', () => {
        isDown = false;
      });

      scroll.addEventListener('touchmove', (event) => {
        if (!isDown) return;
        const x = event.touches[0].pageX - scroll.offsetLeft;
        const walk = (x - startX) * 2;
        scroll.scrollLeft = scrollLeft - walk;
      });
    });
  };

  // -------------------- Search --------------------
  const renderSearchResults = (resultsContainer, matches, query) => {
    resultsContainer.innerHTML = '';

    if (!query) {
      resultsContainer.classList.remove('active');
      return;
    }

    if (!matches.length) {
      const empty = document.createElement('div');
      empty.className = 'search-empty';
      empty.textContent = 'محصولی پیدا نشد.';
      resultsContainer.appendChild(empty);
      resultsContainer.classList.add('active');
      return;
    }

    matches.slice(0, 6).forEach((product) => {
      const item = document.createElement('a');
      item.href = `product.html?id=${product.id}`;
      item.className = 'search-result-item';

      const image = document.createElement('img');
      image.src = window.getSafeImage(product.image);
      image.alt = product.name;
      window.applyImgFallback(image);

      const info = document.createElement('div');
      info.className = 'search-result-info';

      const title = document.createElement('div');
      title.className = 'search-result-title';
      title.textContent = product.name;

      const price = document.createElement('div');
      price.className = 'search-result-price';
      price.textContent = `${PARSPALM_FORMAT_PRICE(product.price)} تومان`;

      info.appendChild(title);
      info.appendChild(price);

      item.appendChild(image);
      item.appendChild(info);

      resultsContainer.appendChild(item);
    });

    resultsContainer.classList.add('active');
  };

  const filterPageProducts = (query) => {
    const cards = document.querySelectorAll('[data-product-name]');
    if (!cards.length) return;

    const q = String(query || '').trim();
    cards.forEach((card) => {
      const name = card.getAttribute('data-product-name') || '';
      const matches = name.includes(q) || name.toLowerCase().includes(q.toLowerCase());
      card.style.display = matches || !q ? '' : 'none';
    });
  };

  const initSearch = () => {
    const searchBars = document.querySelectorAll('.search-bar');
    if (!searchBars.length) return;

    searchBars.forEach((bar) => {
      const input = bar.querySelector('input[type="search"]');
      const resultsContainer = bar.querySelector('.search-results');
      if (!input || !resultsContainer) return;

      const handleSearch = () => {
        const query = input.value.trim();
        const matches = query
          ? PARSPALM_PRODUCTS.filter((p) => p.name.includes(query) || p.name.toLowerCase().includes(query.toLowerCase()))
          : [];
        renderSearchResults(resultsContainer, matches, query);
        filterPageProducts(query);
      };

      input.addEventListener('input', handleSearch);

      document.addEventListener('click', (event) => {
        if (!bar.contains(event.target)) resultsContainer.classList.remove('active');
      });

      resultsContainer.addEventListener('click', () => resultsContainer.classList.remove('active'));
    });
  };

  const initResizeHandler = () => {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => updateCartCount(), 250);
    });
  };

  // -------------------- Export globals --------------------
  window.PARSPALM_PRODUCTS = PARSPALM_PRODUCTS;
  window.PARSPALM_FORMAT_PRICE = PARSPALM_FORMAT_PRICE;
  window.PARSPALM_GET_PRODUCT = PARSPALM_GET_PRODUCT;
  window.PARSPALM_GET_WEIGHT_OPTIONS = PARSPALM_GET_WEIGHT_OPTIONS;
  window.updateCartCount = updateCartCount;

  // نرمال‌سازی تصاویر بعد از export
  window.normalizeProductImages();

  // -------------------- Init --------------------
  document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initThemeToggle();
    initMenu();
    initScrollButtons();
    initDailyTimer();
    initDragScroll();
    initSearch();
    initResizeHandler();
  });
})();
