// order-success.js
(() => {
  const formatPrice =
    window.PARSPALM_FORMAT_PRICE ||
    function (n) {
      try { return new Intl.NumberFormat('fa-IR').format(n); } catch { return String(n); }
    };

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const toFaDateTime = (iso) => {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '—';
      const date = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
      const time = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(d);
      return `${time}، ${date}`;
    } catch {
      return '—';
    }
  };

  const mapPayment = (pm) => {
    if (pm === 'online') return 'پرداخت آنلاین';
    if (pm === 'cod') return 'پرداخت در محل';
    return '—';
  };

  const init = () => {
    const missingEl = document.getElementById('orderMissing');

    let order = null;
    try {
      order = JSON.parse(localStorage.getItem('lastOrder'));
    } catch {
      order = null;
    }

    if (!order || typeof order !== 'object') {
      if (missingEl) missingEl.style.display = 'block';
      setText('orderId', '—');
      setText('paymentMethod', '—');
      setText('orderTime', '—');
      if (typeof window.updateCartCount === 'function') window.updateCartCount();
      return;
    }

    // پشتیبانی از چند نام کلید احتمالی (اگر قبلاً ساختار عوض شده باشد)
    const id = order.id || order.orderId || `PP-${Date.now()}`;
    const createdAt = order.createdAt || order.time || order.created || null;
    const payment = order.paymentMethod || order.payment || order.payMethod || null;

    setText('orderId', String(id));
    setText('paymentMethod', mapPayment(payment));
    setText('orderTime', createdAt ? toFaDateTime(createdAt) : '—');

    // اگر خواستی مبلغ هم اضافه کنی (اختیاری):
    // اگر order.totals وجود داشت، می‌تونی اینجا چاپ کنی.
    // مثال:
    // if (order.totals && typeof order.totals.total === 'number') {
    //   setText('orderTotal', `${formatPrice(order.totals.total)} تومان`);
    // }

    if (typeof window.updateCartCount === 'function') window.updateCartCount();
  };

  document.addEventListener('DOMContentLoaded', init);
})();
