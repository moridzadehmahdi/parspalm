// product.js - اسکریپت صفحه محصول (بازنویسی کامل)
// وابسته به script.js برای دیتای محصولات و توابع:
// PARSPALM_PRODUCTS, PARSPALM_GET_PRODUCT, PARSPALM_GET_WEIGHT_OPTIONS, PARSPALM_FORMAT_PRICE, updateCartCount

let currentProduct = null;

// ---------- Helpers (با فالبک اگر در script.js تعریف نشده باشد) ----------
const PLACEHOLDER_IMG =
  (window.PARSPALM_PLACEHOLDER_IMG && String(window.PARSPALM_PLACEHOLDER_IMG)) ||
  'assets/images/products/placeholder.jpg';

const getSafeImage =
  window.getSafeImage ||
  function (src) {
    if (!src || typeof src !== 'string') return PLACEHOLDER_IMG;
    const s = src.trim();
    return s ? s : PLACEHOLDER_IMG;
  };

const applyImgFallback =
  window.applyImgFallback ||
  function (imgEl) {
    if (!imgEl) return;
    imgEl.addEventListener(
      'error',
      () => {
        imgEl.src = PLACEHOLDER_IMG;
      },
      { once: true }
    );
  };

const formatPrice =
  window.PARSPALM_FORMAT_PRICE ||
  function (n) {
    try {
      return new Intl.NumberFormat('fa-IR').format(n);
    } catch {
      return String(n);
    }
  };

// ---------- UI Actions ----------
const changeImage = (element) => {
  const mainImage = document.getElementById('mainImage');
  if (!mainImage || !element) return;

  mainImage.src = getSafeImage(element.src);
  mainImage.alt = element.alt || mainImage.alt;
  applyImgFallback(mainImage);
};

const decreaseQuantity = () => {
  const quantityInput = document.getElementById('quantity');
  if (!quantityInput) return;

  const current = Number(quantityInput.value);
  if (!Number.isFinite(current)) {
    quantityInput.value = '1';
    return;
  }

  if (current > 1) quantityInput.value = String(current - 1);
};

const increaseQuantity = () => {
  const quantityInput = document.getElementById('quantity');
  if (!quantityInput) return;

  const current = Number(quantityInput.value);
  quantityInput.value = String(Number.isFinite(current) && current > 0 ? current + 1 : 1);
};

const openTab = (event, tabName) => {
  const tabContents = document.getElementsByClassName('tab-content');
  Array.from(tabContents).forEach((tab) => tab.classList.remove('active'));

  const tabLinks = document.getElementsByClassName('tab-link');
  Array.from(tabLinks).forEach((link) => link.classList.remove('active'));

  const activeTab = document.getElementById(tabName);
  if (activeTab) activeTab.classList.add('active');

  if (event && event.currentTarget) event.currentTarget.classList.add('active');
};

// ---------- Price / Weight ----------
const updateProductPrice = () => {
  const priceElement = document.querySelector('.current-price');
  const oldPriceElement = document.querySelector('.old-price');
  const discountElement = document.querySelector('.discount');
  const weightSelect = document.getElementById('weightSelect');

  if (!currentProduct || !priceElement || !weightSelect) return;

  const selected = currentProduct.weights.find((w) => w.value === weightSelect.value) || currentProduct.weights[0];
  if (!selected) return;

  // قیمت فعلی
  priceElement.textContent = `${formatPrice(selected.price)} تومان`;

  // قیمت قبلی / تخفیف (اگر داده شده باشد)
  if (currentProduct.oldPrice && oldPriceElement && discountElement) {
    const scaledOld = Math.round(currentProduct.oldPrice * (selected.price / currentProduct.price));
    oldPriceElement.textContent = `${formatPrice(scaledOld)} تومان`;

    const discountPercent = Math.round(((currentProduct.oldPrice - currentProduct.price) / currentProduct.oldPrice) * 100);
    discountElement.textContent = `${discountPercent}% تخفیف`;
  } else {
    if (oldPriceElement) oldPriceElement.textContent = '';
    if (discountElement) discountElement.textContent = '';
  }
};

// ---------- Cart ----------
const addToCart = () => {
  if (!currentProduct) return;

  const weightSelect = document.getElementById('weightSelect');
  const quantityInput = document.getElementById('quantity');

  const weightValue = weightSelect ? weightSelect.value : '500g';
  const rawQty = quantityInput ? parseInt(quantityInput.value, 10) : 1;
  const quantity = Number.isFinite(rawQty) && rawQty > 0 ? rawQty : 1;

  const weightOption =
    (currentProduct.weights || []).find((w) => w.value === weightValue) || (currentProduct.weights || [])[0];

  const price = weightOption ? weightOption.price : currentProduct.price;

  const product = {
    id: currentProduct.id,
    name: currentProduct.name,
    price,
    weight: weightValue,
    quantity,
    image: getSafeImage(currentProduct.image)
  };

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingIndex = cart.findIndex((item) => item.id === product.id && item.weight === product.weight);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += product.quantity;
  } else {
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));

  if (typeof window.updateCartCount === 'function') window.updateCartCount();

  alert('محصول به سبد خرید افزوده شد!');
};

const buyNow = () => {
  addToCart();
  window.location.href = 'cart.html';
};

// ---------- Rendering ----------
const renderGallery = (gallery, fallbackImage) => {
  const mainImage = document.getElementById('mainImage');
  const thumbnails = document.querySelector('.thumbnails');
  if (!mainImage || !thumbnails || !currentProduct) return;

  const safeFallback = getSafeImage(fallbackImage);
  const raw = Array.isArray(gallery) && gallery.length ? gallery : [safeFallback];
  const images = raw.map(getSafeImage);

  mainImage.src = images[0];
  mainImage.alt = currentProduct.name;
  applyImgFallback(mainImage);

  thumbnails.innerHTML = '';
  images.forEach((src, index) => {
    const thumb = document.createElement('img');
    thumb.src = src;
    thumb.alt = `${currentProduct.name} تصویر ${index + 1}`;
    applyImgFallback(thumb);
    thumb.addEventListener('click', () => changeImage(thumb));
    thumbnails.appendChild(thumb);
  });
};

const renderRelatedProducts = () => {
  const relatedContainer = document.querySelector('.related-products .products-container');
  if (!relatedContainer || !currentProduct || !Array.isArray(window.PARSPALM_PRODUCTS)) return;

  const related = window.PARSPALM_PRODUCTS.filter(
    (p) => p.category === currentProduct.category && String(p.id) !== String(currentProduct.id)
  ).slice(0, 4);

  relatedContainer.innerHTML = '';
  related.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-product-name', product.name);

    const img = document.createElement('img');
    img.src = getSafeImage(product.image);
    img.alt = product.name;
    applyImgFallback(img);

    const title = document.createElement('h3');
    title.textContent = product.name;

    const desc = document.createElement('p');
    desc.textContent = product.description || 'محصولی محبوب و پرفروش از پارس پالم.';

    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = `${formatPrice(product.price)} تومان`;

    const button = document.createElement('button');
    button.className = 'buy-btn';
    button.textContent = 'مشاهده محصول';
    button.addEventListener('click', () => {
      window.location.href = `product.html?id=${product.id}`;
    });

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(price);
    card.appendChild(button);

    relatedContainer.appendChild(card);
  });
};

const renderProductDetails = (product) => {
  if (!product) return;

  const getWeights = window.PARSPALM_GET_WEIGHT_OPTIONS;
  const weights = typeof getWeights === 'function' ? getWeights(product.price) : [{ value: '500g', label: '500 گرم', price: product.price }];

  currentProduct = {
    ...product,
    image: getSafeImage(product.image),
    gallery: Array.isArray(product.gallery) ? product.gallery.map(getSafeImage) : [],
    weights
  };

  const title = document.querySelector('.product-info h1');
  const pageTitle = document.querySelector('title');
  const description = document.querySelector('.description p');
  const weightSelect = document.getElementById('weightSelect');

  if (title) title.textContent = currentProduct.name;
  if (pageTitle) pageTitle.textContent = `${currentProduct.name} - Pars Palm`;
  if (description) description.textContent = currentProduct.description || description.textContent;

  if (weightSelect) {
    weightSelect.innerHTML = '';
    currentProduct.weights.forEach((w) => {
      const option = document.createElement('option');
      option.value = w.value;
      option.textContent = `${w.label} - ${formatPrice(w.price)} تومان`;
      weightSelect.appendChild(option);
    });

    // جلوگیری از اضافه شدن چندباره listener اگر دوباره رندر شد
    weightSelect.onchange = updateProductPrice;
  }

  renderGallery(currentProduct.gallery, currentProduct.image);
  updateProductPrice();
  renderRelatedProducts();
};

const loadProductFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id') || '1';

  const getProduct = window.PARSPALM_GET_PRODUCT;
  const product =
    typeof getProduct === 'function'
      ? getProduct(productId) || getProduct(1)
      : null;

  if (product) renderProductDetails(product);
};

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  loadProductFromQuery();
  if (typeof window.updateCartCount === 'function') window.updateCartCount();
});

// ---------- Expose for inline handlers ----------
window.changeImage = changeImage;
window.decreaseQuantity = decreaseQuantity;
window.increaseQuantity = increaseQuantity;
window.openTab = openTab;
window.addToCart = addToCart;
window.buyNow = buyNow;
