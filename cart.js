// cart.js - اسکریپت صفحه سبد خرید
const formatPrice = (price) => new Intl.NumberFormat('fa-IR').format(price);

const getWeightText = (weight) => {
  const weights = {
    '500g': '500 گرم',
    '1kg': '1 کیلوگرم',
    '2kg': '2 کیلوگرم'
  };
  return weights[weight] || weight;
};

const createCartItem = (item, index) => {
  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'cart-item-image';

  const image = document.createElement('img');
  image.src = item.image;
  image.alt = item.name;
  imageWrapper.appendChild(image);

  const details = document.createElement('div');
  details.className = 'cart-item-details';

  const name = document.createElement('div');
  name.className = 'cart-item-name';
  name.textContent = item.name;

  const weight = document.createElement('div');
  weight.className = 'cart-item-weight';
  weight.textContent = `وزن: ${getWeightText(item.weight)}`;

  const price = document.createElement('div');
  price.className = 'cart-item-price';
  price.textContent = `${formatPrice(item.price * item.quantity)} تومان`;

  const actions = document.createElement('div');
  actions.className = 'cart-item-actions';

  const quantityControl = document.createElement('div');
  quantityControl.className = 'quantity-control';

  const minusButton = document.createElement('button');
  minusButton.type = 'button';
  minusButton.textContent = '-';
  minusButton.addEventListener('click', () => changeQuantity(index, -1));

  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.value = item.quantity;
  quantityInput.min = '1';
  quantityInput.addEventListener('change', (event) => updateQuantity(index, event.target.value));

  const plusButton = document.createElement('button');
  plusButton.type = 'button';
  plusButton.textContent = '+';
  plusButton.addEventListener('click', () => changeQuantity(index, 1));

  quantityControl.appendChild(minusButton);
  quantityControl.appendChild(quantityInput);
  quantityControl.appendChild(plusButton);

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-item';
  removeButton.type = 'button';

  const removeIcon = document.createElement('i');
  removeIcon.className = 'fas fa-trash';
  removeButton.appendChild(removeIcon);
  removeButton.append(' حذف');
  removeButton.addEventListener('click', () => removeItem(index));

  actions.appendChild(quantityControl);
  actions.appendChild(removeButton);

  details.appendChild(name);
  details.appendChild(weight);
  details.appendChild(price);
  details.appendChild(actions);

  cartItem.appendChild(imageWrapper);
  cartItem.appendChild(details);

  return cartItem;
};

const loadCartItems = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsList = document.getElementById('cartItemsList');
  const emptyCart = document.getElementById('emptyCart');

  if (!cartItemsList || !emptyCart) return;

  if (cart.length === 0) {
    emptyCart.style.display = 'flex';
    cartItemsList.style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  cartItemsList.style.display = 'block';
  cartItemsList.innerHTML = '';

  cart.forEach((item, index) => {
    cartItemsList.appendChild(createCartItem(item, index));
  });
};

const changeQuantity = (index, delta) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart[index]) return;
  const newQuantity = cart[index].quantity + delta;

  if (newQuantity < 1) {
    removeItem(index);
    return;
  }

  cart[index].quantity = newQuantity;
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
  updateCartSummary();
  window.updateCartCount();
};

const updateQuantity = (index, newQuantity) => {
  const quantity = parseInt(newQuantity, 10);
  if (Number.isNaN(quantity) || quantity < 1) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart[index]) return;
  cart[index].quantity = quantity;
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
  updateCartSummary();
  window.updateCartCount();
};

const removeItem = (index) => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCartItems();
  updateCartSummary();
  window.updateCartCount();
};

const updateCartSummary = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  let subtotal = 0;

  cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const shipping = subtotal > 300000 ? 0 : 25000;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const subtotalElement = document.getElementById('subtotal');
  const shippingElement = document.getElementById('shipping');
  const discountElement = document.getElementById('discount');
  const totalElement = document.getElementById('total');

  if (subtotalElement) subtotalElement.textContent = `${formatPrice(subtotal)} تومان`;
  if (shippingElement) shippingElement.textContent = shipping === 0 ? 'رایگان' : `${formatPrice(shipping)} تومان`;
  if (discountElement) discountElement.textContent = discount === 0 ? '۰ تومان' : `${formatPrice(discount)} تومان`;
  if (totalElement) totalElement.textContent = `${formatPrice(total)} تومان`;

  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
};

const applyCoupon = () => {
  alert('سیستم کد تخفیف در حال توسعه است!');
};

const proceedToCheckout = () => {
  window.location.href = 'checkout.html';
};

const renderSuggestedProducts = () => {
  const container = document.querySelector('.suggested-products .products-container');
  if (!container || !window.PARSPALM_PRODUCTS) return;

  container.innerHTML = '';
  window.PARSPALM_PRODUCTS.slice(0, 4).forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-product-name', product.name);

    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;

    const title = document.createElement('h3');
    title.textContent = product.name;

    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = `${formatPrice(product.price)} تومان`;

    const button = document.createElement('button');
    button.className = 'buy-btn';
    button.textContent = 'مشاهده محصول';
    button.addEventListener('click', () => {
      window.location.href = `product.html?id=${product.id}`;
    });

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(button);
    container.appendChild(card);
  });
};

document.addEventListener('DOMContentLoaded', function() {
  loadCartItems();
  updateCartSummary();
  renderSuggestedProducts();
});

window.loadCartItems = loadCartItems;
window.updateCartSummary = updateCartSummary;
window.applyCoupon = applyCoupon;
window.proceedToCheckout = proceedToCheckout;
window.changeQuantity = changeQuantity;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
