$(function () {
  requireAuth();
  renderHeader('customers.html');
  let editingId = null;

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function loadCustomers(search = '') {
    $.ajax({
      url: '/api/customers?search=' + encodeURIComponent(search),
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const tbody = $('#customersTable tbody').empty();
        if (!rows.length) {
          tbody.append('<tr><td colspan="6" style="text-align:center;">No customers found</td></tr>');
          return;
        }
        rows.forEach(c => {
          tbody.append(`
            <tr>
              <td>${c.id}</td>
              <td>${escapeHtml(c.name)}</td>
              <td>${escapeHtml(c.email)}</td>
              <td>${escapeHtml(c.phone)}</td>
              <td>${escapeHtml(c.address)}</td>
              <td>
                <button class="btn warn edit-btn" data-id="${c.id}">Edit</button>
                <button class="btn danger delete-btn" data-id="${c.id}">Delete</button>
              </td>
            </tr>
          `);
        });
      }
    });
  }

  $(document).on('click', '.edit-btn', function () {
    const id = $(this).data('id');
    $.ajax({
      url: '/api/customers/' + id,
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (c) {
        editingId = c.id;
        $('#name').val(c.name);
        $('#email').val(c.email);
        $('#phone').val(c.phone);
        $('#address').val(c.address);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  $(document).on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    if (!confirm('Delete this customer?')) return;
    $.ajax({
      url: '/api/customers/' + id,
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: () => {
        showMessage($('#msg'), 'Customer deleted');
        loadCustomers($('#searchBox').val());
      }
    });
  });

  $('#resetBtn').on('click', function () {
    editingId = null;
    $('#customerForm')[0].reset();
  });

  $('#searchBox').on('input', function () {
    loadCustomers($(this).val());
  });

  $('#customerForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      name: $('#name').val(),
      email: $('#email').val(),
      phone: $('#phone').val(),
      address: $('#address').val()
    };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? '/api/customers/' + editingId : '/api/customers';

    $.ajax({
      url: url,
      method: method,
      headers: {
        Authorization: 'Bearer ' + getToken(),
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(payload),
      success: () => {
        showMessage($('#msg'), 'Customer saved!');
        editingId = null;
        $('#customerForm')[0].reset();
        loadCustomers();
      },
      error: (xhr) => showMessage($('#msg'), xhr.responseJSON?.error || 'Error', 'error')
    });
  });

  loadCustomers();
});