// product.js - اسکریپت صفحه محصول
function changeImage(element) {
  document.getElementById('mainImage').src = element.src;
}

function decreaseQuantity() {
  const quantityInput = document.getElementById('quantity');
  if (quantityInput.value > 1) {
    quantityInput.value = parseInt(quantityInput.value) - 1;
  }
}

function increaseQuantity() {
  const quantityInput = document.getElementById('quantity');
  quantityInput.value = parseInt(quantityInput.value) + 1;
}

function openTab(tabName) {
  // مخفی کردن همه تب‌ها
  const tabContents = document.getElementsByClassName('tab-content');
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove('active');
  }
  
  // غیرفعال کردن همه دکمه‌ها
  const tabLinks = document.getElementsByClassName('tab-link');
  for (let i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove('active');
  }
  
  // نمایش تب انتخاب شده
  document.getElementById(tabName).classList.add('active');
  event.currentTarget.classList.add('active');
}

function addToCart() {
  const product = {
    id: 1,
    name: 'خرما پیارم ممتاز',
    price: 150000,
    weight: document.getElementById('weightSelect').value,
    quantity: parseInt(document.getElementById('quantity').value),
    image: 'assets/images/products/piarom-1.jpg'
  };
  
  // دریافت سبد خرید موجود از localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // بررسی آیا محصول قبلاً در سبد وجود دارد
  const existingItemIndex = cart.findIndex(item => 
    item.id === product.id && item.weight === product.weight
  );
  
  if (existingItemIndex !== -1) {
    // افزایش تعداد اگر محصول قبلاً وجود دارد
    cart[existingItemIndex].quantity += product.quantity;
  } else {
    // افزودن محصول جدید به سبد
    cart.push(product);
  }
  
  // ذخیره سبد خرید به روز شده
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // به روز کردن شمارنده سبد خرید
  updateCartCount();
  
  // نمایش پیام موفقیت
  alert('محصول به سبد خرید افزوده شد!');
}

function buyNow() {
  addToCart();
  // هدایت به صفحه سبد خرید
  window.location.href = 'cart.html';
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // به روز کردن شمارنده در همه صفحات
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
  });
}

// به روز کردن شمارنده سبد خرید هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
});