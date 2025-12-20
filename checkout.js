// checkout.js - اسکریپت صفحه تسویه حساب
const formatPrice = (price) => new Intl.NumberFormat('fa-IR').format(price);

const getWeightText = (weight) => {
  const weights = {
    '500g': '500 گرم',
    '1kg': '1 کیلوگرم',
    '2kg': '2 کیلوگرم'
  };
  return weights[weight] || weight;
};

const loadOrderSummary = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const orderItemsContainer = document.getElementById('orderItems');

  if (!orderItemsContainer) return;

  if (cart.length === 0) {
    orderItemsContainer.textContent = 'سبد خرید شما خالی است';
    return;
  }

  orderItemsContainer.innerHTML = '';

  let subtotal = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemElement = document.createElement('div');
    itemElement.className = 'order-item';

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'order-item-image';

    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.name;
    imageWrapper.appendChild(image);

    const details = document.createElement('div');
    details.className = 'order-item-details';

    const name = document.createElement('div');
    name.className = 'order-item-name';
    name.textContent = item.name;

    const price = document.createElement('div');
    price.className = 'order-item-price';
    price.textContent = `${formatPrice(itemTotal)} تومان`;

    const quantity = document.createElement('div');
    quantity.className = 'order-item-quantity';
    quantity.textContent = `تعداد: ${item.quantity} - وزن: ${getWeightText(item.weight)}`;

    details.appendChild(name);
    details.appendChild(price);
    details.appendChild(quantity);

    itemElement.appendChild(imageWrapper);
    itemElement.appendChild(details);
    orderItemsContainer.appendChild(itemElement);
  });

  const shipping = subtotal > 300000 ? 0 : 25000;
  const total = subtotal + shipping;

  const subtotalElement = document.getElementById('summarySubtotal');
  const shippingElement = document.getElementById('summaryShipping');
  const discountElement = document.getElementById('summaryDiscount');
  const totalElement = document.getElementById('summaryTotal');

  if (subtotalElement) subtotalElement.textContent = `${formatPrice(subtotal)} تومان`;
  if (shippingElement) shippingElement.textContent = shipping === 0 ? 'رایگان' : `${formatPrice(shipping)} تومان`;
  if (discountElement) discountElement.textContent = '۰ تومان';
  if (totalElement) totalElement.textContent = `${formatPrice(total)} تومان`;
};

const setupProvinceCityDependency = () => {
  const provinceSelect = document.getElementById('province');
  const citySelect = document.getElementById('city');

  if (!provinceSelect || !citySelect) return;

  const citiesByProvince = {
    tehran: ['تهران', 'شهریار', 'اسلامشهر', 'رباط کریم'],
    fars: ['شیراز', 'مرودشت', 'کازرون', 'فسا'],
    khozestan: ['اهواز', 'آبادان', 'خرمشهر', 'دزفول']
  };

  provinceSelect.addEventListener('change', function() {
    const province = this.value;
    citySelect.innerHTML = '<option value="">انتخاب شهر</option>';

    if (province && citiesByProvince[province]) {
      citiesByProvince[province].forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
      });
    }
  });
};

const loadSavedAddress = () => {
  const savedAddress = JSON.parse(localStorage.getItem('userAddress'));

  if (!savedAddress) return;

  const fields = [
    'firstName',
    'lastName',
    'phone',
    'email',
    'province',
    'address',
    'postalCode'
  ];

  fields.forEach(field => {
    const element = document.getElementById(field);
    if (element) {
      element.value = savedAddress[field] || '';
    }
  });

  const provinceElement = document.getElementById('province');
  if (savedAddress.province && provinceElement) {
    const event = new Event('change');
    provinceElement.dispatchEvent(event);

    setTimeout(() => {
      const cityElement = document.getElementById('city');
      if (cityElement) {
        cityElement.value = savedAddress.city || '';
      }
    }, 100);
  }

  const saveInfoElement = document.getElementById('saveInfo');
  if (saveInfoElement) {
    saveInfoElement.checked = savedAddress.saveInfo || false;
  }
};

const validateForm = () => {
  const requiredFields = ['firstName', 'lastName', 'phone', 'province', 'city', 'address', 'postalCode'];
  let isValid = true;

  requiredFields.forEach(field => {
    const element = document.getElementById(field);
    if (element && !element.value.trim()) {
      element.classList.add('input-error');
      isValid = false;
      setTimeout(() => {
        element.classList.remove('input-error');
      }, 2000);
    }
  });

  const phoneElement = document.getElementById('phone');
  const phone = phoneElement ? phoneElement.value : '';
  const phoneRegex = /^09[0-9]{9}$/;
  if (phone && !phoneRegex.test(phone)) {
    alert('شماره تلفن معتبر نیست. فرمت صحیح: 09123456789');
    if (phoneElement) {
      phoneElement.classList.add('input-error');
      setTimeout(() => {
        phoneElement.classList.remove('input-error');
      }, 2000);
    }
    isValid = false;
  }

  return isValid;
};

const saveAddressInfo = () => {
  const addressInfo = {
    firstName: document.getElementById('firstName')?.value || '',
    lastName: document.getElementById('lastName')?.value || '',
    phone: document.getElementById('phone')?.value || '',
    email: document.getElementById('email')?.value || '',
    province: document.getElementById('province')?.value || '',
    city: document.getElementById('city')?.value || '',
    address: document.getElementById('address')?.value || '',
    postalCode: document.getElementById('postalCode')?.value || '',
    saveInfo: true
  };

  localStorage.setItem('userAddress', JSON.stringify(addressInfo));
};

const nextStep = () => {
  if (!validateForm()) return;

  if (document.getElementById('saveInfo')?.checked) {
    saveAddressInfo();
  }

  window.location.href = 'checkout-review.html';
};

document.addEventListener('DOMContentLoaded', function() {
  loadOrderSummary();
  setupProvinceCityDependency();
  loadSavedAddress();
});

window.nextStep = nextStep;
