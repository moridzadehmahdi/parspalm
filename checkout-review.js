// checkout-review.js - صفحه بازبینی سفارش
(() => {
  const formatPrice =
    window.PARSPALM_FORMAT_PRICE ||
    function (n) {
      try {
        return new Intl.NumberFormat('fa-IR').format(n);
      } catch {
        return String(n);
      }
    };

  const getSafeImage =
    window.getSafeImage ||
    function (src) {
      return typeof src === 'string' && src.trim() ? src.trim() : 'assets/images/products/placeholder.jpg';
    };

  const applyImgFallback =
    window.applyImgFallback ||
    function (imgEl) {
      if (!imgEl) return;
      imgEl.addEventListener(
        'error',
        () => {
          imgEl.src = 'assets/images/products/placeholder.jpg';
        },
        { once: true }
      );
    };

  const getWeightText = (weight) => {
    const weights = { '500g': '500 گرم', '1kg': '1 کیلوگرم', '2kg': '2 کیلوگرم' };
    return weights[weight] || weight;
  };

  const readCart = () => JSON.parse(localStorage.getItem('cart')) || [];
  const readAddress = () => JSON.parse(localStorage.getItem('userAddress')) || null;

  const alertBox = (message) => {
    const el = document.getElementById('reviewAlert');
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
  };

  const clearAlert = () => {
    const el = document.getElementById('reviewAlert');
    if (!el) return;
    el.textContent = '';
    el.style.display = 'none';
  };

  const renderAddress = () => {
    const addressBox = document.getElementById('addressBox');
    if (!addressBox) return;

    const address = readAddress();
    if (!address) {
      addressBox.innerHTML = `
        <div class="address-empty">
          اطلاعات گیرنده ثبت نشده است.
          <a href="checkout.html" class="link-btn">ثبت اطلاعات</a>
        </div>
      `;
      return;
    }

    const fullName = `${address.firstName || ''} ${address.lastName || ''}`.trim() || '—';
    const phone = address.phone || '—';
    const email = address.email || '—';
    const province = address.province || '—';
    const city = address.city || '—';
    const postalCode = address.postalCode || '—';
    const addr = address.address || '—';

    addressBox.innerHTML = `
      <div class="address-row"><span>نام و نام خانوادگی:</span><strong>${fullName}</strong></div>
      <div class="address-row"><span>تلفن:</span><strong>${phone}</strong></div>
      <div class="address-row"><span>ایمیل:</span><strong>${email}</strong></div>
      <div class="address-row"><span>استان / شهر:</span><strong>${province} / ${city}</strong></div>
      <div class="address-row"><span>آدرس:</span><strong>${addr}</strong></div>
      <div class="address-row"><span>کد پستی:</span><strong>${postalCode}</strong></div>
    `;
  };

  const renderItems = () => {
    const cart = readCart();
    const container = document.getElementById('reviewItems');
    if (!container) return;

    if (!cart.length) {
      container.innerHTML = `<div class="review-empty">سبد خرید شما خالی است.</div>`;
      return;
    }

    container.innerHTML = '';

    cart.forEach((item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      const total = qty * price;

      const row = document.createElement('div');
      row.className = 'review-item';

      const img = document.createElement('img');
      img.src = getSafeImage(item.image);
      img.alt = item.name || 'محصول';
      applyImgFallback(img);

      const info = document.createElement('div');
      info.className = 'review-item-info';

      const title = document.createElement('div');
      title.className = 'review-item-title';
      title.textContent = item.name || 'محصول';

      const meta = document.createElement('div');
      meta.className = 'review-item-meta';
      meta.textContent = `تعداد: ${qty} | وزن: ${getWeightText(item.weight)}`;

      const priceEl = document.createElement('div');
      priceEl.className = 'review-item-price';
      priceEl.textContent = `${formatPrice(total)} تومان`;

      info.appendChild(title);
      info.appendChild(meta);

      row.appendChild(img);
      row.appendChild(info);
      row.appendChild(priceEl);

      container.appendChild(row);
    });
  };

  const renderSummary = () => {
    const cart = readCart();

    const subtotal = cart.reduce((sum, item) => {
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      return sum + qty * price;
    }, 0);

    const shipping = subtotal > 300000 ? 0 : (cart.length ? 25000 : 0);
    const discount = 0;
    const total = subtotal + shipping - discount;

    const subtotalEl = document.getElementById('reviewSubtotal');
    const shippingEl = document.getElementById('reviewShipping');
    const discountEl = document.getElementById('reviewDiscount');
    const totalEl = document.getElementById('reviewTotal');

    if (subtotalEl) subtotalEl.textContent = `${formatPrice(subtotal)} تومان`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'رایگان' : `${formatPrice(shipping)} تومان`;
    if (discountEl) discountEl.textContent = '۰ تومان';
    if (totalEl) totalEl.textContent = `${formatPrice(total)} تومان`;
  };

  const validateBeforeConfirm = () => {
    const cart = readCart();
    const address = readAddress();

    if (!cart.length) {
      alertBox('سبد خرید شما خالی است. ابتدا محصولی اضافه کنید.');
      return false;
    }

    if (!address || !address.firstName || !address.lastName || !address.phone || !address.province || !address.city || !address.address || !address.postalCode) {
      alertBox('اطلاعات گیرنده کامل نیست. لطفاً به صفحه تسویه حساب برگردید و اطلاعات را کامل کنید.');
      return false;
    }

    clearAlert();
    return true;
  };

  const confirmOrder = () => {
    if (!validateBeforeConfirm()) return;

    // فعلاً سفارش واقعی نداریم: فقط شبیه‌سازی
    const payment = document.querySelector('input[name="payment"]:checked')?.value || 'online';

    // می‌توانی اینجا orderId بسازی و در localStorage ذخیره کنی
    const orderId = `PP-${Date.now()}`;
    localStorage.setItem(
      'lastOrder',
      JSON.stringify({
        id: orderId,
        payment,
        createdAt: new Date().toISOString()
      })
    );

    // خالی کردن سبد
    localStorage.removeItem('cart');
    if (typeof window.updateCartCount === 'function') window.updateCartCount();

    alert(`سفارش شما ثبت شد.\nکد سفارش: ${orderId}`);

    // مقصد بعد از ثبت سفارش (فعلاً)
    window.location.href = 'index.html';
  };

  const bindActions = () => {
    const backBtn = document.getElementById('backToCheckoutBtn');
    const confirmBtn = document.getElementById('confirmOrderBtn');

    if (backBtn) backBtn.addEventListener('click', () => (window.location.href = 'checkout.html'));
    if (confirmBtn) confirmBtn.addEventListener('click', confirmOrder);
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderAddress();
    renderItems();
    renderSummary();
    bindActions();
    if (typeof window.updateCartCount === 'function') window.updateCartCount();
  });
})();
