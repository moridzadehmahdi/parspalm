let currentProduct = null;

const changeImage = (element) => {
  const mainImage = document.getElementById('mainImage');
  if (mainImage && element) {
    mainImage.src = element.src;
    mainImage.alt = element.alt || mainImage.alt;
  }
};

const decreaseQuantity = () => {
  const quantityInput = document.getElementById('quantity');
  if (quantityInput && Number(quantityInput.value) > 1) {
    quantityInput.value = String(Number(quantityInput.value) - 1);
  }
};

const increaseQuantity = () => {
  const quantityInput = document.getElementById('quantity');
  if (quantityInput) {
    quantityInput.value = String(Number(quantityInput.value) + 1);
  }
};

const openTab = (event, tabName) => {
  const tabContents = document.getElementsByClassName('tab-content');
  Array.from(tabContents).forEach(tab => tab.classList.remove('active'));

  const tabLinks = document.getElementsByClassName('tab-link');
  Array.from(tabLinks).forEach(link => link.classList.remove('active'));

  const activeTab = document.getElementById(tabName);
  if (activeTab) {
    activeTab.classList.add('active');
  }

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }
};

const updateProductPrice = () => {
  const priceElement = document.querySelector('.current-price');
  const oldPriceElement = document.querySelector('.old-price');
  const discountElement = document.querySelector('.discount');
  const weightSelect = document.getElementById('weightSelect');

  if (!currentProduct || !priceElement || !weightSelect) return;

  const weightOption = currentProduct.weights.find(weight => weight.value === weightSelect.value);
  if (!weightOption) return;

  priceElement.textContent = `${window.PARSPALM_FORMAT_PRICE(weightOption.price)} تومان`;

  if (currentProduct.oldPrice) {
    oldPriceElement.textContent = `${window.PARSPALM_FORMAT_PRICE(
      Math.round(currentProduct.oldPrice * (weightOption.price / currentProduct.price))
    )} تومان`;
    const discount = Math.round(((currentProduct.oldPrice - currentProduct.price) / currentProduct.oldPrice) * 100);
    discountElement.textContent = `${discount}% تخفیف`;
  } else {
    oldPriceElement.textContent = '';
    discountElement.textContent = '';
  }
};

const addToCart = () => {
  if (!currentProduct) return;

  const weightSelect = document.getElementById('weightSelect');
  const quantityInput = document.getElementById('quantity');
  const weightValue = weightSelect ? weightSelect.value : '500g';
  const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 1;

  const weightOption = currentProduct.weights.find(weight => weight.value === weightValue) || currentProduct.weights[0];

  const product = {
    id: currentProduct.id,
    name: currentProduct.name,
    price: weightOption.price,
    weight: weightValue,
    quantity: quantity > 0 ? quantity : 1,
    image: currentProduct.image
  };

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItemIndex = cart.findIndex(item => item.id === product.id && item.weight === product.weight);

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += product.quantity;
  } else {
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  window.updateCartCount();

  alert('محصول به سبد خرید افزوده شد!');
};

const buyNow = () => {
  addToCart();
  window.location.href = 'cart.html';
};

const renderGallery = (gallery, fallback) => {
  const mainImage = document.getElementById('mainImage');
  const thumbnails = document.querySelector('.thumbnails');
  if (!mainImage || !thumbnails) return;

  const images = gallery && gallery.length ? gallery : [fallback];
  mainImage.src = images[0];
  mainImage.alt = currentProduct.name;

  thumbnails.innerHTML = '';
  images.forEach((image, index) => {
    const thumb = document.createElement('img');
    thumb.src = image;
    thumb.alt = `${currentProduct.name} تصویر ${index + 1}`;
    thumb.addEventListener('click', () => changeImage(thumb));
    thumbnails.appendChild(thumb);
  });
};

const renderRelatedProducts = () => {
  const relatedContainer = document.querySelector('.related-products .products-container');
  if (!relatedContainer || !currentProduct) return;

  const related = window.PARSPALM_PRODUCTS.filter(
    product => product.category === currentProduct.category && product.id !== currentProduct.id
  ).slice(0, 4);

  relatedContainer.innerHTML = '';
  related.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-product-name', product.name);

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;

    const title = document.createElement('h3');
    title.textContent = product.name;

    const desc = document.createElement('p');
    desc.textContent = product.description || 'محصولی محبوب و پرفروش از پارس پالم.';

    const price = document.createElement('span');
    price.className = 'price';
    price.textContent = `${window.PARSPALM_FORMAT_PRICE(product.price)} تومان`;

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
    relatedContainer.appendChild(card);
  });
};

const renderProductDetails = (product) => {
  currentProduct = {
    ...product,
    weights: window.PARSPALM_GET_WEIGHT_OPTIONS(product.price)
  };

  const title = document.querySelector('.product-info h1');
  const pageTitle = document.querySelector('title');
  const description = document.querySelector('.description p');
  const weightSelect = document.getElementById('weightSelect');

  if (title) title.textContent = product.name;
  if (pageTitle) pageTitle.textContent = `${product.name} - Pars Palm`;
  if (description) description.textContent = product.description || description.textContent;

  if (weightSelect) {
    weightSelect.innerHTML = '';
    currentProduct.weights.forEach(weight => {
      const option = document.createElement('option');
      option.value = weight.value;
      option.textContent = `${weight.label} - ${window.PARSPALM_FORMAT_PRICE(weight.price)} تومان`;
      weightSelect.appendChild(option);
    });

    weightSelect.addEventListener('change', updateProductPrice);
  }

  renderGallery(product.gallery, product.image);
  updateProductPrice();
  renderRelatedProducts();
};

const loadProductFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id') || '1';
  const product = window.PARSPALM_GET_PRODUCT(productId) || window.PARSPALM_GET_PRODUCT(1);
  if (product) {
    renderProductDetails(product);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadProductFromQuery();
  window.updateCartCount();
});

window.changeImage = changeImage;
window.decreaseQuantity = decreaseQuantity;
window.increaseQuantity = increaseQuantity;
window.openTab = openTab;
window.addToCart = addToCart;
window.buyNow = buyNow;
