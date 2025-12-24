// checkout-review.js
(() => {
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
      imgEl.addEventListener('error', () => (imgEl.src = PLACEHOLDER_IMG), { once: true });
    };

  const formatPrice =
    window.PARSPALM_FORMAT_PRICE ||
    function (n) {
      try { return new Intl.NumberFormat('fa-IR').format(n); } catch { return String(n); }
    };

  const getWeightText = (weight) => {
    const map = { '500g': '500 گرم', '1kg': '1 کیلوگرم', '2kg': '2 کیلوگرم' };
    return map[weight] || weight || '-';
  };

  const readCart = () => JSON.parse(localStorage.getItem('cart')) || [];
  const readAddress = () => JSON.parse(localStorage.getItem('userAddress')) || null;

  const calcTotals = (cart) => {
    const subtotal = cart.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
    const shipping = subtotal > 300000 ? 0 : (cart.length ? 25000 : 0);
    const discount = 0;
    const total = subtotal + shipping - discount;
    return { subtotal, shipping, discount, total };
  };

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  const showAlert = (msg) => {
    const alertEl = document.getElementById('reviewAlert');
    if (!alertEl) return;
    alertEl.style.display = 'block';
    alertEl.textContent = msg;
  };

  const renderAddress = () => {
    const box = document.getElementById('addressBox');
    if (!box) return;

    const addr = readAddress();
    if (!addr) {
      box.innerHTML = `<div style="color: var(--muted);">آدرسی ثبت نشده. لطفاً اطلاعات را در صفحه تسویه حساب وارد کنید.</div>`;
      return;
    }

    const fullName = `${addr.firstName || ''} ${addr.lastName || ''}`.trim();
    const provinceCity = `${addr.province || '-'} / ${addr.city || '-'}`;

    box.innerHTML = `
      <div class="review-line"><strong>نام و نام خانوادگی:</strong> ${fullName || '-'}</div>
      <div class="review-line"><strong>تلفن:</strong> ${addr.phone || '-'}</div>
      <div class="review-line"><strong>ایمیل:</strong> ${addr.email || '-'}</div>
      <div class="review-line"><strong>استان / شهر:</strong> ${provinceCity}</div>
      <div class="review-line"><strong>آدرس:</strong> ${addr.address || '-'}</div>
      <div class="review-line"><strong>کد پستی:</strong> ${addr.postalCode || '-'}</div>
    `;
  };

  const renderItems = (cart) => {
    const list = document.getElementById('reviewItems');
    if (!list) return;

    if (!cart.length) {
      list.innerHTML = `<div style="color: var(--muted);">سبد خرید شما خالی است.</div>`;
      return;
    }

    list.innerHTML = '';
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

      const meta = document.createElement('div');
      meta.className = 'meta';

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = item.name || 'محصول';

      const sub = document.createElement('div');
      sub.className = 'sub';
      sub.textContent = `تعداد: ${qty} | وزن: ${getWeightText(item.weight)}`;

      const p = document.createElement('div');
      p.className = 'price';
      p.textContent = `${formatPrice(total)} تومان`;

      meta.appendChild(title);
      meta.appendChild(sub);
      meta.appendChild(p);

      row.appendChild(img);
      row.appendChild(meta);
      list.appendChild(row);
    });
  };

  const renderSummary = (totals) => {
    setText('reviewSubtotal', `${formatPrice(totals.subtotal)} تومان`);
    setText('reviewShipping', totals.shipping === 0 ? 'رایگان' : `${formatPrice(totals.shipping)} تومان`);
    setText('reviewDiscount', `${formatPrice(totals.discount)} تومان`);
    setText('reviewTotal', `${formatPrice(totals.total)} تومان`);
  };

  const getPaymentMethod = () => {
    const checked = document.querySelector('input[name="payment"]:checked');
    return checked ? checked.value : 'online';
  };

  const confirmOrder = () => {
    const cart = readCart();
    if (!cart.length) {
      showAlert('سبد خرید شما خالی است. ابتدا محصولی به سبد خرید اضافه کنید.');
      return;
    }

    const address = readAddress();
    if (!address) {
      showAlert('اطلاعات گیرنده ثبت نشده است. لطفاً به صفحه تسویه حساب برگردید.');
      return;
    }

    const totals = calcTotals(cart);

    const order = {
      id: `PP-${Date.now()}`,
      createdAt: new Date().toISOString(),
      paymentMethod: getPaymentMethod(), // online | cod
      address,
      items: cart,
      totals
    };

    localStorage.setItem('lastOrder', JSON.stringify(order));
    localStorage.removeItem('cart');

    if (typeof window.updateCartCount === 'function') window.updateCartCount();

    window.location.href = 'order-success.html';
  };

  const initButtons = () => {
    const backBtn = document.getElementById('backToCheckoutBtn');
    if (backBtn) backBtn.addEventListener('click', () => (window.location.href = 'checkout.html'));

    const confirmBtn = document.getElementById('confirmOrderBtn');
    if (confirmBtn) confirmBtn.addEventListener('click', confirmOrder);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const cart = readCart();
    const totals = calcTotals(cart);

    renderAddress();
    renderItems(cart);
    renderSummary(totals);
    initButtons();

    if (typeof window.updateCartCount === 'function') window.updateCartCount();
  });
})();
