// cart.js - اسکریپت صفحه سبد خرید (بازنویسی کامل)
// وابسته به script.js برای:
// window.PARSPALM_PRODUCTS, window.updateCartCount, window.getSafeImage, window.applyImgFallback, window.PARSPALM_FORMAT_PRICE

(() => {
  // ---------- Helpers ----------
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
  const writeCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

  const safeNumber = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  // ---------- DOM Builders ----------
  const createCartItem = (item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    // Image
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'cart-item-image';

    const image = document.createElement('img');
    image.src = getSafeImage(item.image);
    image.alt = item.name || 'محصول';
    applyImgFallback(image);
    imageWrapper.appendChild(image);

    // Details
    const details = document.createElement('div');
    details.className = 'cart-item-details';

    const name = document.createElement('div');
    name.className = 'cart-item-name';
    name.textContent = item.name || 'محصول';

    const weight = document.createElement('div');
    weight.className = 'cart-item-weight';
    weight.textContent = `وزن: ${getWeightText(item.weight)}`;

    const price = document.createElement('div');
    price.className = 'cart-item-price';
    const itemTotal = safeNumber(item.price) * safeNumber(item.quantity, 1);
    price.textContent = `${formatPrice(itemTotal)} تومان`;

    // Actions
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
    quantityInput.min = '1';
    quantityInput.value = String(safeNumber(item.quantity, 1));
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

  // ---------- Render ----------
  const loadCartItems = () => {
    const cart = readCart();
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');

    if (!cartItemsList || !emptyCart) return;

    if (!cart.length) {
      emptyCart.style.display = 'flex';
      cartItemsList.style.display = 'none';
      cartItemsList.innerHTML = '';
      return;
    }

    emptyCart.style.display = 'none';
    cartItemsList.style.display = 'block';
    cartItemsList.innerHTML = '';

    cart.forEach((item, index) => {
      cartItemsList.appendChild(createCartItem(item, index));
    });
  };

  const updateCartSummary = () => {
    const cart = readCart();

    const subtotal = cart.reduce((sum, item) => {
      return sum + safeNumber(item.price) * safeNumber(item.quantity, 1);
    }, 0);

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
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  };

  const renderSuggestedProducts = () => {
    const container = document.querySelector('.suggested-products .products-container');
    const products = Array.isArray(window.PARSPALM_PRODUCTS) ? window.PARSPALM_PRODUCTS : null;
    if (!container || !products) return;

    container.innerHTML = '';

    products.slice(0, 4).forEach((product) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.setAttribute('data-product-name', product.name || '');

      const image = document.createElement('img');
      image.src = getSafeImage(product.image);
      image.alt = product.name || 'محصول';
      applyImgFallback(image);

      const title = document.createElement('h3');
      title.textContent = product.name || 'محصول';

      const price = document.createElement('span');
      price.className = 'price';
      price.textContent = `${formatPrice(safeNumber(product.price))} تومان`;

      const button = document.createElement('button');
      button.className = 'buy-btn';
      button.type = 'button';
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

  // ---------- Actions ----------
  const syncUI = () => {
    loadCartItems();
    updateCartSummary();
    if (typeof window.updateCartCount === 'function') window.updateCartCount();
  };

  const changeQuantity = (index, delta) => {
    const cart = readCart();
    if (!cart[index]) return;

    const currentQty = safeNumber(cart[index].quantity, 1);
    const newQty = currentQty + delta;

    if (newQty < 1) {
      cart.splice(index, 1);
      writeCart(cart);
      syncUI();
      return;
    }

    cart[index].quantity = newQty;
    writeCart(cart);
    syncUI();
  };

  const updateQuantity = (index, newQuantity) => {
    const cart = readCart();
    if (!cart[index]) return;

    const qty = parseInt(newQuantity, 10);
    if (!Number.isFinite(qty) || qty < 1) {
      // اگر ورودی خراب بود UI را به مقدار قبلی برگردان
      loadCartItems();
      return;
    }

    cart[index].quantity = qty;
    writeCart(cart);
    syncUI();
  };

  const removeItem = (index) => {
    const cart = readCart();
    if (!cart[index]) return;

    cart.splice(index, 1);
    writeCart(cart);
    syncUI();
  };

  const applyCoupon = () => {
    alert('سیستم کد تخفیف در حال توسعه است!');
  };

  const proceedToCheckout = () => {
    const cart = readCart();
    if (!cart.length) {
      alert('سبد خرید شما خالی است.');
      return;
    }
    window.location.href = 'checkout.html';
  };

  // ---------- Init ----------
  document.addEventListener('DOMContentLoaded', () => {
    syncUI();
    renderSuggestedProducts();
  });

  // ---------- Expose (اگر در HTML از inline handler استفاده شده باشد) ----------
  window.loadCartItems = loadCartItems;
  window.updateCartSummary = updateCartSummary;
  window.applyCoupon = applyCoupon;
  window.proceedToCheckout = proceedToCheckout;
  window.changeQuantity = changeQuantity;
  window.updateQuantity = updateQuantity;
  window.removeItem = removeItem;
})();
