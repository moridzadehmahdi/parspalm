// account.js - اسکریپت صفحه حساب کاربری
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fa-IR', options);
};

const formatPrice = (price) => new Intl.NumberFormat('fa-IR').format(price);

const getStatusText = (status) => {
  const statusMap = {
    pending: 'در انتظار پرداخت',
    processing: 'در حال پردازش',
    completed: 'تکمیل شده',
    cancelled: 'لغو شده'
  };

  return statusMap[status] || status;
};

const displayRecentOrders = (orders) => {
  const recentOrdersContainer = document.querySelector('.recent-orders');
  if (!recentOrdersContainer) return;

  if (orders.length === 0) {
    recentOrdersContainer.innerHTML = '<p>هنوز سفارشی ثبت نکرده اید.</p>';
    return;
  }

  const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentOrders = sortedOrders.slice(0, 5);

  let ordersHTML = `
    <h3>آخرین سفارش ها</h3>
    <div class="orders-list">
  `;

  recentOrders.forEach(order => {
    ordersHTML += `
      <div class="order-item">
        <div class="order-header">
          <span class="order-id">سفارش #${order.id}</span>
          <span class="order-date">${formatDate(order.date)}</span>
        </div>
        <div class="order-details">
          <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
          <span class="order-total">${formatPrice(order.total)} تومان</span>
        </div>
      </div>
    `;
  });

  ordersHTML += `
    </div>
    <a href="#" class="view-all-orders">مشاهده همه سفارش ها</a>
  `;

  recentOrdersContainer.innerHTML = ordersHTML;
};

const loadUserStats = () => {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];

  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length >= 3) {
    statNumbers[0].textContent = orders.length;
    statNumbers[1].textContent = wishlist.length;
    statNumbers[2].textContent = addresses.length;
  }

  displayRecentOrders(orders);
};

const loadUserData = () => {
  const userData = JSON.parse(localStorage.getItem('user')) || {
    name: 'مهمان',
    email: '-'
  };

  const userName = document.querySelector('.user-name');
  const userEmail = document.querySelector('.user-email');

  if (userName) userName.textContent = userData.name;
  if (userEmail) userEmail.textContent = userData.email;

  loadUserStats();
};

const initTabs = () => {
  const tabLinks = document.querySelectorAll('.menu-item[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabLinks.length === 0) return;

  tabLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();

      tabLinks.forEach(item => item.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.classList.add('active');
      }
    });
  });
};

const initLogout = () => {
  const logoutBtn = document.querySelector('.logout');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', function(event) {
    event.preventDefault();
    if (confirm('آیا از خروج از حساب کاربری خود مطمئن هستید؟')) {
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    }
  });
};

document.addEventListener('DOMContentLoaded', function() {
  initTabs();
  initLogout();
  loadUserData();
});
