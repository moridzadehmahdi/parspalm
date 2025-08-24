// cart.js - اسکریپت صفحه سبد خرید
document.addEventListener('DOMContentLoaded', function() {
  loadCartItems();
  updateCartSummary();
});

function loadCartItems() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsList = document.getElementById('cartItemsList');
  const emptyCart = document.getElementById('emptyCart');
  
  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartItemsList.style.display = 'none';
    return;
  }
  
  emptyCart.style.display = 'none';
  cartItemsList.style.display = 'block';
  cartItemsList.innerHTML = '';
  
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-weight">وزن: ${getWeightText(item.weight)}</div>
        <div class="cart-item-price">${formatPrice(item.price * item.quantity)} تومان</div>
        <div class="cart-item-actions">
          <div class="quantity-control">
            <button onclick="changeQuantity(${index}, -1)">-</button>
            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </div>
          <button class="remove-item" onclick="removeItem(${index})">
            <i class="fas fa-trash"></i> حذف
          </button>
        </div>
      </div>
    `;
    cartItemsList.appendChild(cartItem);
  });
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

function changeQuantity(index, delta) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const newQuantity = cart[index].quantity + delta;
  
  if (newQuantity < 1) {
    removeItem(index);
    return;
  }
  
  cart[index].quantity = newQuantity;
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
  updateCartSummary();
  updateCartCount();
}

function updateQuantity(index, newQuantity) {
  const quantity = parseInt(newQuantity);
  if (isNaN(quantity) || quantity < 1) return;
  
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart[index].quantity = quantity;
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
  updateCartSummary();
  updateCartCount();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
  updateCartSummary();
  updateCartCount();
}

function updateCartSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let subtotal = 0;
  
  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  // محاسبه هزینه ارسال (رایگان برای خریدهای بالای 300,000 تومان)
  const shipping = subtotal > 300000 ? 0 : 25000;
  
  // اعمال تخفیف (می‌توانید سیستم کد تخفیف پیاده‌سازی کنید)
  const discount = 0;
  
  const total = subtotal + shipping - discount;
  
  document.getElementById('subtotal').textContent = formatPrice(subtotal) + ' تومان';
  document.getElementById('shipping').textContent = shipping === 0 ? 'رایگان' : formatPrice(shipping) + ' تومان';
  document.getElementById('discount').textContent = discount === 0 ? '۰ تومان' : formatPrice(discount) + ' تومان';
  document.getElementById('total').textContent = formatPrice(total) + ' تومان';
  
  // غیرفعال کردن دکمه پرداخت اگر سبد خرید خالی است
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

function applyCoupon() {
  const couponCode = document.getElementById('couponCode').value;
  // اینجا می‌توانید منطق اعمال کد تخفیف را پیاده‌سازی کنید
  alert('سیستم کد تخفیف در حال توسعه است!');
}

function proceedToCheckout() {
  window.location.href = 'checkout.html';
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
  });
}