// account.js - اسکریپت صفحه حساب کاربری
document.addEventListener('DOMContentLoaded', function() {
  // مدیریت تب‌ها
  const tabLinks = document.querySelectorAll('.menu-item[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // حذف کلاس active از همه تب‌ها
      tabLinks.forEach(item => item.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // اضافه کردن کلاس active به تب انتخاب شده
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // مدیریت خروج
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('آیا از خروج از حساب کاربری خود مطمئن هستید؟')) {
        // پاک کردن اطلاعات کاربر از localStorage
        localStorage.removeItem('user');
        // هدایت به صفحه اصلی
        window.location.href = 'index.html';
      }
    });
  }
  
  // بارگذاری اطلاعات کاربر
  loadUserData();
});

function loadUserData() {
  const userData = JSON.parse(localStorage.getItem('user')) || {
    name: 'مهمان',
    email: '-'
  };
  
  // به روز کردن اطلاعات در صفحه
  document.querySelector('.user-name').textContent = userData.name;
  document.querySelector('.user-email').textContent = userData.email;
  
  // بارگذاری آمار
  loadUserStats();
}

function loadUserStats() {
  // در اینجا می‌توانید اطلاعات آماری کاربر را از سرور دریافت کنید
  // فعلاً با اطلاعات نمونه کار می‌کند
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
  
  document.querySelectorAll('.stat-number')[0].textContent = orders.length;
  document.querySelectorAll('.stat-number')[1].textContent = wishlist.length;
  document.querySelectorAll('.stat-number')[2].textContent = addresses.length;
  
  // نمایش آخرین سفارش‌ها
  displayRecentOrders(orders);
}

function displayRecentOrders(orders) {
  const recentOrdersContainer = document.querySelector('.recent-orders');
  
  if (orders.length === 0) {
    recentOrdersContainer.innerHTML = '<p>هنوز سفارشی ثبت نکرده‌اید.</p>';
    return;
  }
  
  // مرتب کردن سفارش‌ها بر اساس تاریخ (جدیدترین اول)
  const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentOrders = sortedOrders.slice(0, 5); // 5 سفارش آخر
  
  let ordersHTML = `
    <h3>آخرین سفارش‌ها</h3>
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
    <a href="#" class="view-all-orders">مشاهده همه سفارش‌ها</a>
  `;
  
  recentOrdersContainer.innerHTML = ordersHTML;
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fa-IR', options);
}

function formatPrice(price) {
  return new Intl.NumberFormat('fa-IR').format(price);
}

function getStatusText(status) {
  const statusMap = {
    'pending': 'در انتظار پرداخت',
    'processing': 'در حال پردازش',
    'completed': 'تکمیل شده',
    'cancelled': 'لغو شده'
  };
  
  return statusMap[status] || status;
}