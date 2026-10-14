$(function () {
  requireAuth();
  renderHeader('payments.html');

  function loadPayments() {
    $.ajax({
      url: '/api/payments',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const tbody = $('#paymentsTable tbody').empty();
        rows.forEach(p => {
          tbody.append(`
            <tr>
              <td>${p.id}</td><td>${p.booking_id}</td><td>${p.guest_name}</td>
              <td>$${parseFloat(p.amount).toFixed(2)}</td>
              <td>${p.mode}</td>
              <td>${p.status}</td>
              <td>${p.transaction_ref || ''}</td>
              <td>
                ${p.status !== 'paid' ? `
                  <button class="btn success" onclick="markPaid(${p.id})">Mark Paid</button>` : ''}
              </td>
            </tr>
          `);
        });
      }
    });
  }

  window.markPaid = function (id) {
    if (!confirm('Mark this payment as Paid?')) return;
    $.ajax({
      url: '/api/payments/' + id + '/status', method: 'PUT',
      headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      data: JSON.stringify({ status: 'paid', mode: 'card' }),
      success: () => { loadPayments(); }
    });
  };

  loadPayments();
});