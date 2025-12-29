// product.js — صفحه محصول (بازنویسی تمیز + مقاوم)
// وابسته به script.js برای:
// PARSPALM_PRODUCTS, PARSPALM_GET_PRODUCT, PARSPALM_GET_WEIGHT_OPTIONS, PARSPALM_FORMAT_PRICE, refreshCartCount

(() => {
  'use strict';

  // -------------------- State --------------------
  let currentProduct = null;

  // -------------------- Fallbacks / Helpers --------------------
  const PLACEHOLDER_IMG =
    (window.PARSPALM_PLACEHOLDER_IMG && String(window.PARSPALM_PLACEHOLDER_IMG)) ||
    'assets/images/products/placeholder.jpg';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const safeStr = (v, fb = '') => (typeof v === 'string' ? v.trim() || fb : fb);

  const getSafeImage =
    window.getSafeImage ||
    function (src) {
      const s = safeStr(src, '');
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
        return new Intl.NumberFormat('fa-IR').format(Number(n) || 0);
      } catch {
        return String(n);
      }
    };

  const clampInt = (n, min, max) => {
    const x = parseInt(n, 10);
    if (!Number.isFinite(x)) return min;
    return Math.max(min, Math.min(max, x));
  };

  const getCart = () => {
    try {
      const raw = localStorage.getItem('cart');
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };

  const setCart = (arr) => {
    try {
      localStorage.setItem('cart', JSON.stringify(arr));
      window.dispatchEvent(new Event('cart:updated'));
    } catch {
      // ignore
    }
  };

  // -------------------- UI Actions (Expose) --------------------
  const changeImage = (element) => {
    const mainImage = $('#mainImage');
    if (!mainImage || !element) return;

    mainImage.src = getSafeImage(element.src);
    mainImage.alt = element.alt || mainImage.alt || '';
    applyImgFallback(mainImage);

    // (اختیاری) هایلایت بندانگشتی فعال
    const thumbs = $$('.thumbnails img');
    thumbs.forEach((t) => t.classList.remove('active'));
    if (element.classList) element.classList.add('active');
  };

  const decreaseQuantity = () => {
    const quantityInput = $('#quantity');
    if (!quantityInput) return;
    quantityInput.value = String(clampInt(quantityInput.value, 1, 9999) - 1 < 1 ? 1 : clampInt(quantityInput.value, 1, 9999) - 1);
  };

  const increaseQuantity = () => {
    const quantityInput = $('#quantity');
    if (!quantityInput) return;
    quantityInput.value = String(clampInt(quantityInput.value, 1, 9999) + 1);
  };

  const openTab = (event, tabName) => {
    $$('.tab-content').forEach((tab) => tab.classList.remove('active'));
    $$('.tab-link').forEach((link) => link.classList.remove('active'));

    const activeTab = document.getElementById(tabName);
    if (activeTab) activeTab.classList.add('active');

    if (event && event.currentTarget) event.currentTarget.classList.add('active');
  };

  // -------------------- Price / Weight --------------------
  const getSelectedWeight = () => {
    if (!currentProduct || !Array.isArray(currentProduct.weights) || !currentProduct.weights.length) return null;
    const weightSelect = $('#weightSelect');
    if (!weightSelect) return currentProduct.weights[0] || null;

    return currentProduct.weights.find((w) => w.value === weightSelect.value) || currentProduct.weights[0] || null;
  };

  const updateProductPrice = () => {
    const priceElement = $('.current-price');
    const oldPriceElement = $('.old-price');
    const discountElement = $('.discount');

    if (!currentProduct || !priceElement) return;

    const selected = getSelectedWeight();
    if (!selected) return;

    const current = Number(selected.price) || 0;
    priceElement.textContent = `${formatPrice(current)} تومان`;

    // Old price / discount (اگر oldPrice موجود باشد)
    const baseOld = Number(currentProduct.oldPrice);
    const basePrice = Number(currentProduct.price);

    if (baseOld && basePrice && oldPriceElement && discountElement) {
      // مقیاس‌کردن oldPrice متناسب با وزن انتخابی
      const scaledOld = Math.round(baseOld * (current / basePrice));
      oldPriceElement.textContent = `${formatPrice(scaledOld)} تومان`;

      const discountPercent = scaledOld > 0 ? Math.round(((scaledOld - current) / scaledOld) * 100) : 0;
      discountElement.textContent = discountPercent > 0 ? `${discountPercent}% تخفیف` : '';
    } else {
      if (oldPriceElement) oldPriceElement.textContent = '';
      if (discountElement) discountElement.textContent = '';
    }
  };

  // -------------------- Cart --------------------
  const addToCart = () => {
    if (!currentProduct) return;

    const weightSelect = $('#weightSelect');
    const quantityInput = $('#quantity');

    const weightValue = weightSelect ? safeStr(weightSelect.value, '500g') : '500g';
    const quantity = quantityInput ? clampInt(quantityInput.value, 1, 9999) : 1;

    const weightOption =
      (currentProduct.weights || []).find((w) => w.value === weightValue) || (currentProduct.weights || [])[0];

    const price = weightOption ? Number(weightOption.price) || 0 : Number(currentProduct.price) || 0;

    const productItem = {
      id: currentProduct.id,
      name: currentProduct.name,
      price,
      weight: weightValue,
      quantity,
      image: getSafeImage(currentProduct.image),
      category: currentProduct.category || ''
    };

    const cart = getCart();
    const idx = cart.findIndex((it) => String(it.id) === String(productItem.id) && String(it.weight) === String(productItem.weight));

    if (idx !== -1) cart[idx].quantity = clampInt((cart[idx].quantity || 0) + productItem.quantity, 1, 9999);
    else cart.push(productItem);

    setCart(cart);

    // شمارنده سبد خرید (اگر وجود دارد)
    if (typeof window.refreshCartCount === 'function') window.refreshCartCount();

    alert('محصول به سبد خرید افزوده شد!');
  };

  const buyNow = () => {
    addToCart();
    window.location.href = 'cart.html';
  };

  // -------------------- Rendering --------------------
  const renderGallery = (gallery, fallbackImage) => {
    const mainImage = $('#mainImage');
    const thumbnails = $('.thumbnails');
    if (!mainImage || !thumbnails || !currentProduct) return;

    const safeFallback = getSafeImage(fallbackImage);
    const raw = Array.isArray(gallery) && gallery.length ? gallery : [safeFallback];
    const images = raw.map(getSafeImage);

    mainImage.src = images[0];
    mainImage.alt = currentProduct.name || '';
    applyImgFallback(mainImage);

    thumbnails.innerHTML = '';

    images.forEach((src, index) => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.alt = `${currentProduct.name} تصویر ${index + 1}`;
      applyImgFallback(thumb);

      if (index === 0) thumb.classList.add('active');

      thumb.addEventListener('click', () => changeImage(thumb));
      thumbnails.appendChild(thumb);
    });
  };

  const renderRelatedProducts = () => {
    // اگر ساختارت اسکرولی است ترجیحاً .products-scroll را پر کن، وگرنه خود container
    const root = $('.related-products');
    if (!root || !currentProduct || !Array.isArray(window.PARSPALM_PRODUCTS)) return;

    const rail = $('.products-scroll', root) || $('.products-container', root);
    if (!rail) return;

    const related = window.PARSPALM_PRODUCTS
      .filter((p) => p && p.category === currentProduct.category && String(p.id) !== String(currentProduct.id))
      .slice(0, 4);

    rail.innerHTML = '';

    related.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.setAttribute('data-product-name', product.name || '');

      const img = document.createElement('img');
      img.src = getSafeImage(product.image);
      img.alt = product.name || '';
      applyImgFallback(img);

      const title = document.createElement('h3');
      title.textContent = product.name || 'محصول';

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

      rail.appendChild(card);
    });
  };

  const renderProductDetails = (product) => {
    if (!product) return;

    const getWeights = window.PARSPALM_GET_WEIGHT_OPTIONS;
    const weights =
      typeof getWeights === 'function'
        ? getWeights(product.price)
        : [{ value: '500g', label: '500 گرم', price: product.price }];

    currentProduct = {
      ...product,
      name: safeStr(product.name, 'محصول'),
      image: getSafeImage(product.image),
      gallery: Array.isArray(product.gallery) ? product.gallery.map(getSafeImage) : [],
      weights: Array.isArray(weights) && weights.length ? weights : [{ value: '500g', label: '500 گرم', price: product.price }]
    };

    const titleEl = $('.product-info h1');
    const pageTitleEl = $('title');
    const descriptionEl = $('.description p');
    const weightSelect = $('#weightSelect');

    if (titleEl) titleEl.textContent = currentProduct.name;
    if (pageTitleEl) pageTitleEl.textContent = `${currentProduct.name} - Pars Palm`;
    if (descriptionEl && currentProduct.description) descriptionEl.textContent = currentProduct.description;

    if (weightSelect) {
      weightSelect.innerHTML = '';
      currentProduct.weights.forEach((w) => {
        const opt = document.createElement('option');
        opt.value = w.value;
        opt.textContent = `${w.label} - ${formatPrice(w.price)} تومان`;
        weightSelect.appendChild(opt);
      });

      // فقط یک handler (بدون تجمع)
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

  // -------------------- Init --------------------
  document.addEventListener('DOMContentLoaded', () => {
    loadProductFromQuery();

    // کنترل ورودی تعداد (اگر کاربر دستی تایپ کند)
    const qty = $('#quantity');
    if (qty) {
      qty.addEventListener('input', () => {
        qty.value = String(clampInt(qty.value, 1, 9999));
      });
    }

    if (typeof window.refreshCartCount === 'function') window.refreshCartCount();
  });

  // -------------------- Expose (برای inline handlers) --------------------
  window.changeImage = changeImage;
  window.decreaseQuantity = decreaseQuantity;
  window.increaseQuantity = increaseQuantity;
  window.openTab = openTab;
  window.addToCart = addToCart;
  window.buyNow = buyNow;
})();
