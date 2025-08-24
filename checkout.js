// checkout.js - اسکریپت صفحه تسویه حساب
document.addEventListener('DOMContentLoaded', function() {
  loadOrderSummary();
  setupProvinceCityDependency();
  loadSavedAddress();
});

function loadOrderSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderItemsContainer = document.getElementById('orderItems');
  
  if (cart.length === 0) {
    orderItemsContainer.innerHTML = '<p>سبد خرید شما خالی است</p>';
    return;
  }
  
  let itemsHTML = '';
  let subtotal = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    itemsHTML += `
      <div class="order-item">
        <div class="order-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="order-item-details">
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-price">${formatPrice(itemTotal)} تومان</div>
          <div class="order-item-quantity">تعداد: ${item.quantity} - وزن: ${getWeightText(item.weight)}</div>
        </div>
      </div>
    `;
  });
  
  orderItemsContainer.innerHTML = itemsHTML;
  
  // محاسبه هزینه ارسال (رایگان برای خریدهای بالای 300,000 تومان)
  const shipping = subtotal > 300000 ? 0 : 25000;
  const total = subtotal + shipping;
  
  document.getElementById('summarySubtotal').textContent = formatPrice(subtotal) + ' تومان';
  document.getElementById('summaryShipping').textContent = shipping === 0 ? 'رایگان' : formatPrice(shipping) + ' تومان';
  document.getElementById('summaryDiscount').textContent = '۰ تومان';
  document.getElementById('summaryTotal').textContent = formatPrice(total) + ' تومان';
}

function getWeightText(weight) {
  const weights = {
    '500g': '500 گرم',
    '1kg': '1 کیلوگرم',
    '2kg': '2 کیلوگرم'
  };
  return weights[weight] || weight;
}

function formatPrice(price) {
  return new Intl.NumberFormat('fa-IR').format(price);
}

function setupProvinceCityDependency() {
  const provinceSelect = document.getElementById('province');
  const citySelect = document.getElementById('city');
  
  // داده‌های نمونه برای استان‌ها و شهرها
  const citiesByProvince = {
    'tehran': ['تهران', 'شهریار', 'اسلامشهر', 'رباط کریم'],
    'fars': ['شیراز', 'مرودشت', 'کازرون', 'فسا'],
    'khozestan': ['اهواز', 'آبادان', 'خرمشهر', 'دزفول']
    // سایر استان‌ها...
  };
  
  provinceSelect.addEventListener('change', function() {
    const province = this.value;
    citySelect.innerHTML = '<option value="">انتخاب شهر</option>';
    
    if (province && citiesByProvince[province]) {
      citiesByProvince[province].forEach(city => {
        citySelect.innerHTML += `<option value="${city}">${city}</option>`;
      });
    }
  });
}

function loadSavedAddress() {
  const savedAddress = JSON.parse(localStorage.getItem('userAddress'));
  
  if (savedAddress) {
    document.getElementById('firstName').value = savedAddress.firstName || '';
    document.getElementById('lastName').value = savedAddress.lastName || '';
    document.getElementById('phone').value = savedAddress.phone || '';
    document.getElementById('email').value = savedAddress.email || '';
    document.getElementById('province').value = savedAddress.province || '';
    
    // ایجاد تغییر در استان برای بارگذاری شهرها
    if (savedAddress.province) {
      const event = new Event('change');
      document.getElementById('province').dispatchEvent(event);
      
      // تأخیر برای اطمینان از بارگذاری شهرها
      setTimeout(() => {
        document.getElementById('city').value = savedAddress.city || '';
      }, 100);
    }
    
    document.getElementById('address').value = savedAddress.address || '';
    document.getElementById('postalCode').value = savedAddress.postalCode || '';
    document.getElementById('saveInfo').checked = savedAddress.saveInfo || false;
  }
}

function nextStep() {
  // اعتبارسنجی فرم
  if (!validateForm()) {
    return;
  }
  
  // ذخیره اطلاعات اگر کاربر انتخاب کرده
  if (document.getElementById('saveInfo').checked) {
    saveAddressInfo();
  }
  
  // هدایت به مرحله بعد
  window.location.href = 'checkout-review.html';
}

function validateForm() {
  const requiredFields = [
    'firstName', 'lastName', 'phone', 'province', 'city', 'address', 'postalCode'
  ];
  
  let isValid = true;
  
  requiredFields.forEach(field => {
    const element = document.getElementById(field);
    if (!element.value.trim()) {
      element.style.borderColor = 'var(--red)';
      isValid = false;
      
      // بازنشانی رنگ پس از 2 ثانیه
      setTimeout(() => {
        element.style.borderColor = '#e5b567';
      }, 2000);
    }
  });
  
  // اعتبارسنجی شماره تلفن
  const phone = document.getElementById('phone').value;
  const phoneRegex = /^09[0-9]{9}$/;
  if (phone && !phoneRegex.test(phone)) {
    alert('شماره تلفن معتبر نیست. فرمت صحیح: 09123456789');
    document.getElementById('phone').style.borderColor = 'var(--red)';
    isValid = false;
    
    setTimeout(() => {
      document.getElementById('phone').style.borderColor = '#e5b567';
    }, 2000);
  }
  
  return isValid;
}

function saveAddressInfo() {
  const addressInfo = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    province: document.getElementById('province').value,
    city: document.getElementById('city').value,
    address: document.getElementById('address').value,
    postalCode: document.getElementById('postalCode').value,
    saveInfo: true
  };
  
  localStorage.setItem('userAddress', JSON.stringify(addressInfo));
}