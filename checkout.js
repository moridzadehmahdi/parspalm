// checkout.js - اسکریپت صفحه تسویه حساب (بازنویسی کامل + فالبک عکس + سازگاری بهتر)
// نکته: این فایل به script.js متکی است (برای updateCartCount و helperهای اختیاری)

(() => {
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

  const getWeightText = (weight) => {
    const weights = {
      '500g': '500 گرم',
      '1kg': '1 کیلوگرم',
      '2kg': '2 کیلوگرم'
    };
    return weights[weight] || weight;
  };

  const readCart = () => JSON.parse(localStorage.getItem('cart')) || [];

  const writeUserAddress = (addressInfo) => {
    localStorage.setItem('userAddress', JSON.stringify(addressInfo));
  };

  // ---------- Order Summary ----------
  const loadOrderSummary = () => {
    const cart = readCart();
    const orderItemsContainer = document.getElementById('orderItems');

    if (!orderItemsContainer) return;

    if (cart.length === 0) {
      orderItemsContainer.textContent = 'سبد خرید شما خالی است';
      // اعداد خلاصه را هم صفر کنیم
      const subtotalElement = document.getElementById('summarySubtotal');
      const shippingElement = document.getElementById('summaryShipping');
      const discountElement = document.getElementById('summaryDiscount');
      const totalElement = document.getElementById('summaryTotal');
      if (subtotalElement) subtotalElement.textContent = '۰ تومان';
      if (shippingElement) shippingElement.textContent = '۰ تومان';
      if (discountElement) discountElement.textContent = '۰ تومان';
      if (totalElement) totalElement.textContent = '۰ تومان';
      return;
    }

    orderItemsContainer.innerHTML = '';

    let subtotal = 0;

    cart.forEach((item) => {
      const safePrice = Number(item.price) || 0;
      const safeQty = Number(item.quantity) || 1;
      const itemTotal = safePrice * safeQty;
      subtotal += itemTotal;

      const itemElement = document.createElement('div');
      itemElement.className = 'order-item';

      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'order-item-image';

      const image = document.createElement('img');
      image.src = getSafeImage(item.image);
      image.alt = item.name || 'محصول';
      applyImgFallback(image);
      imageWrapper.appendChild(image);

      const details = document.createElement('div');
      details.className = 'order-item-details';

      const name = document.createElement('div');
      name.className = 'order-item-name';
      name.textContent = item.name || 'محصول';

      const price = document.createElement('div');
      price.className = 'order-item-price';
      price.textContent = `${formatPrice(itemTotal)} تومان`;

      const quantity = document.createElement('div');
      quantity.className = 'order-item-quantity';
      quantity.textContent = `تعداد: ${safeQty} - وزن: ${getWeightText(item.weight)}`;

      details.appendChild(name);
      details.appendChild(price);
      details.appendChild(quantity);

      itemElement.appendChild(imageWrapper);
      itemElement.appendChild(details);

      orderItemsContainer.appendChild(itemElement);
    });

    const shipping = subtotal > 300000 ? 0 : 25000;
    const discount = 0;
    const total = subtotal + shipping - discount;

    const subtotalElement = document.getElementById('summarySubtotal');
    const shippingElement = document.getElementById('summaryShipping');
    const discountElement = document.getElementById('summaryDiscount');
    const totalElement = document.getElementById('summaryTotal');

    if (subtotalElement) subtotalElement.textContent = `${formatPrice(subtotal)} تومان`;
    if (shippingElement) shippingElement.textContent = shipping === 0 ? 'رایگان' : `${formatPrice(shipping)} تومان`;
    if (discountElement) discountElement.textContent = '۰ تومان';
    if (totalElement) totalElement.textContent = `${formatPrice(total)} تومان`;
  };

  // ---------- Province / City Dependency ----------
  const setupProvinceCityDependency = () => {
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');

    if (!provinceSelect || !citySelect) return;

    const citiesByProvince = {
      tehran: ['تهران', 'شهریار', 'اسلامشهر', 'رباط کریم'],
      fars: ['شیراز', 'مرودشت', 'کازرون', 'فسا'],
      khozestan: ['اهواز', 'آبادان', 'خرمشهر', 'دزفول']
    };

    const renderCities = (provinceKey) => {
      citySelect.innerHTML = '<option value="">انتخاب شهر</option>';
      const cities = citiesByProvince[provinceKey];
      if (!cities) return;

      cities.forEach((city) => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    };

    provinceSelect.addEventListener('change', () => {
      renderCities(provinceSelect.value);
    });

    // اگر از قبل انتخاب شده بود (مثلاً از autofill مرورگر)
    if (provinceSelect.value) {
      renderCities(provinceSelect.value);
    }
  };

  // ---------- Saved Address ----------
  const loadSavedAddress = () => {
    const savedAddress = JSON.parse(localStorage.getItem('userAddress'));
    if (!savedAddress) return;

    const fields = ['firstName', 'lastName', 'phone', 'email', 'province', 'address', 'postalCode'];
    fields.forEach((field) => {
      const el = document.getElementById(field);
      if (el) el.value = savedAddress[field] || '';
    });

    const provinceEl = document.getElementById('province');
    const cityEl = document.getElementById('city');

    // ست کردن شهر بعد از اینکه شهرها populate شدند
    if (provinceEl && savedAddress.province) {
      provinceEl.value = savedAddress.province;

      // تغییر را دستی trigger کن تا لیست شهرها ساخته شود
      provinceEl.dispatchEvent(new Event('change'));

      if (cityEl) {
        // بعد از ساخت گزینه‌ها
        setTimeout(() => {
          cityEl.value = savedAddress.city || '';
        }, 0);
      }
    }

    const saveInfoEl = document.getElementById('saveInfo');
    if (saveInfoEl) saveInfoEl.checked = !!savedAddress.saveInfo;
  };

  // ---------- Validation ----------
  const markInputError = (el) => {
    if (!el) return;
    el.classList.add('input-error');
    setTimeout(() => el.classList.remove('input-error'), 2000);
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'phone', 'province', 'city', 'address', 'postalCode'];

    let isValid = true;
    requiredFields.forEach((id) => {
      const el = document.getElementById(id);
      if (el && !String(el.value || '').trim()) {
        markInputError(el);
        isValid = false;
      }
    });

    const phoneEl = document.getElementById('phone');
    const phone = phoneEl ? String(phoneEl.value || '').trim() : '';
    const phoneRegex = /^09\d{9}$/;

    if (phone && !phoneRegex.test(phone)) {
      alert('شماره تلفن معتبر نیست. فرمت صحیح: 09123456789');
      markInputError(phoneEl);
      isValid = false;
    }

    return isValid;
  };

  // ---------- Save Address ----------
  const saveAddressInfo = () => {
    const addressInfo = {
      firstName: document.getElementById('firstName')?.value?.trim() || '',
      lastName: document.getElementById('lastName')?.value?.trim() || '',
      phone: document.getElementById('phone')?.value?.trim() || '',
      email: document.getElementById('email')?.value?.trim() || '',
      province: document.getElementById('province')?.value || '',
      city: document.getElementById('city')?.value || '',
      address: document.getElementById('address')?.value?.trim() || '',
      postalCode: document.getElementById('postalCode')?.value?.trim() || '',
      saveInfo: true
    };

    writeUserAddress(addressInfo);
  };

  // ---------- Navigation / Next Step ----------
  // توجه: checkout.html فعلی دکمه "مرحله بعد" دارد و روی checkout-review.html می‌فرستد
  // اگر هنوز checkout-review.html نداری، این مسیر را یا بساز یا موقتاً به پرداخت/صفحه موفقیت بفرست.
  const nextStep = () => {
    if (!validateForm()) return;

    const saveInfoEl = document.getElementById('saveInfo');
    if (saveInfoEl && saveInfoEl.checked) saveAddressInfo();

    // اگر cart خالی است، اجازه ادامه نده
    const cart = readCart();
    if (!cart.length) {
      alert('سبد خرید شما خالی است.');
      return;
    }

    window.location.href = 'checkout-review.html';
  };

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    loadOrderSummary();
    setupProvinceCityDependency();
    loadSavedAddress();

    if (typeof window.updateCartCount === 'function') window.updateCartCount();
  });

  // ---------- Expose for inline handler ----------
  window.nextStep = nextStep;
})();
