$(function () {
  requireAuth();
  renderHeader('bookings.html');

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function loadCustomersAndShows() {
    $.ajax({
      url: '/api/customers',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const sel = $('#customer_id').empty().append('<option value="">Select Customer</option>');
        rows.forEach(c => {
          sel.append(`<option value="${c.id}">${c.name} (${c.email})</option>`);
        });
      }
    });

    $.ajax({
      url: '/api/shows',
      success: function (rows) {
        const sel = $('#show_id').empty().append('<option value="">Select Show</option>');
        rows.forEach(s => {
          const d = s.show_date.toString().split('T')[0];
          sel.append(`<option value="${s.id}">
            #${s.id} ${s.movie_title} - ${s.screen_name} ${d} ${s.show_time}
            | $${s.ticket_price} | ${s.available_seats} seats
          </option>`);
        });
      }
    });
  }

  function loadBookings(date = '') {
    const url = '/api/bookings' + (date ? '?date=' + date : '');
    $.ajax({
      url: url,
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const tbody = $('#bookingsTable tbody').empty();
        if (!rows.length) {
          tbody.append('<tr><td colspan="10" style="text-align:center;">No bookings</td></tr>');
          return;
        }
        rows.forEach(b => {
          const d = b.show_date.toString().split('T')[0];
          tbody.append(`
            <tr>
              <td>${b.id}</td>
              <td>${escapeHtml(b.customer_name)}</td>
              <td>${escapeHtml(b.customer_email)}</td>
              <td>${escapeHtml(b.movie_title)}</td>
              <td>${b.screen_name}</td>
              <td>${d} ${b.show_time}</td>
              <td>${b.seats_booked}</td>
              <td>$${parseFloat(b.total_amount).toFixed(2)}</td>
              <td>${b.status}</td>
              <td><button class="btn danger delete-btn" data-id="${b.id}">Cancel</button></td>
            </tr>
          `);
        });
      }
    });
  }

  $(document).on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    if (!confirm('Cancel this booking?')) return;
    $.ajax({
      url: '/api/bookings/' + id,
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: () => loadBookings($('#filterDate').val())
    });
  });

  $('#bookingForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      customer_id: $('#customer_id').val(),
      show_id: $('#show_id').val(),
      seats_booked: $('#seats_booked').val()
    };

    $.ajax({
      url: '/api/bookings',
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + getToken(),
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(payload),
      success: function (res) {
        showMessage($('#msg'), 'Booking successful! Total: $' + res.total_amount);

        $.ajax({
          url: '/api/payments',
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + getToken(),
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({
            booking_id: res.id,
            amount: res.total_amount,
            mode: 'card',
            status: 'pending'
          })
        });

        $('#bookingForm')[0].reset();
        loadBookings($('#filterDate').val());
      },
      error: (xhr) => showMessage($('#msg'), xhr.responseJSON?.error || 'Error', 'error')
    });
  });

  $('#filterDate').on('change', function () {
    loadBookings($(this).val());
  });

  // ============ REPORT ============
  $('#generateReport').on('click', function () {
    const from = $('#reportFrom').val();
    const to = $('#reportTo').val();
    let url = '/api/bookings/report';
    const params = [];
    if (from) params.push('from=' + from);
    if (to) params.push('to=' + to);
    if (params.length) url += '?' + params.join('&');

    $.ajax({
      url: url,
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (data) {
        $('#reportSummary').show();
        $('#rTotalBookings').text(data.summary.total_bookings);
        $('#rTotalSeats').text(data.summary.total_seats);
        $('#rTotalRevenue').text('$' + parseFloat(data.summary.total_revenue).toFixed(2));
        $('#rCancelled').text(data.summary.cancelled_count);

        const tbody = $('#reportTable tbody').empty();
        if (!data.rows.length) {
          tbody.append('<tr><td colspan="9" style="text-align:center;">No data for this period</td></tr>');
          return;
        }
        data.rows.forEach(r => {
          const d = r.show_date.toString().split('T')[0];
          tbody.append(`
            <tr>
              <td>${r.booking_id}</td>
              <td>${escapeHtml(r.customer_name)}</td>
              <td>${escapeHtml(r.movie_title)}</td>
              <td>${r.screen_name}</td>
              <td>${d}</td>
              <td>${r.seats_booked}</td>
              <td>$${parseFloat(r.total_amount).toFixed(2)}</td>
              <td>${r.booking_status}</td>
              <td>${r.payment_status || 'N/A'}</td>
            </tr>
          `);
        });
      },
      error: (xhr) => alert('Error: ' + (xhr.responseJSON?.error || 'Failed'))
    });
  });

  $('#downloadCSV').on('click', function () {
    const from = $('#reportFrom').val();
    const to = $('#reportTo').val();
    let url = '/api/bookings/report/csv';
    const params = [];
    if (from) params.push('from=' + from);
    if (to) params.push('to=' + to);
    if (params.length) url += '?' + params.join('&');

    fetch(url, { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'bookings-report-' + Date.now() + '.csv';
        link.click();
      })
      .catch(err => alert('Download failed: ' + err.message));
  });

  loadCustomersAndShows();
  loadBookings();
});