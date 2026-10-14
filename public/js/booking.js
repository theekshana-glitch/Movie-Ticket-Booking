$(function () {
  requireAuth();
  renderHeader('bookings.html');

  function loadShows() {
    $.ajax({
      url: '/api/shows',
      success: function (rows) {
        const sel = $('#show_id').empty().append('<option value="">Select Show</option>');
        rows.forEach(s => {
          sel.append(`<option value="${s.id}" data-price="${s.ticket_price}" data-avail="${s.available_seats}">
            #${s.id} ${s.movie_title} - ${s.screen_name} ${s.show_date.toString().split('T')[0]} ${s.show_time}
            | $${s.ticket_price} | ${s.available_seats} seats
          </option>`);
        });
      }
    });
  }

  function loadBookings(date = '') {
    $.ajax({
      url: '/api/bookings' + (date ? '?date=' + date : ''),
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const tbody = $('#bookingsTable tbody').empty();
        rows.forEach(b => {
          tbody.append(`
            <tr>
              <td>${b.id}</td><td>${b.guest_name}</td><td>${b.guest_email}</td>
              <td>${b.movie_title}</td>
              <td>${b.screen_name}</td>
              <td>${b.show_date.toString().split('T')[0]} ${b.show_time}</td>
              <td>${b.seats_booked}</td>
              <td>$${parseFloat(b.total_amount).toFixed(2)}</td>
              <td>${b.status}</td>
              <td>
                <button class="btn danger" onclick="deleteBooking(${b.id})">Cancel</button>
              </td>
            </tr>
          `);
        });
      }
    });
  }

  window.deleteBooking = function (id) {
    if (!confirm('Cancel this booking?')) return;
    $.ajax({
      url: '/api/bookings/' + id, method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: () => loadBookings($('#filterDate').val())
    });
  };

  $('#bookingForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      guest_name: $('#guest_name').val(),
      guest_email: $('#guest_email').val(),
      guest_phone: $('#guest_phone').val(),
      show_id: $('#show_id').val(),
      seats_booked: $('#seats_booked').val()
    };
    $.ajax({
      url: '/api/bookings', method: 'POST',
      headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      data: JSON.stringify(payload),
      success: function (res) {
        showMessage($('#msg'), 'Booking successful! Total: $' + res.total_amount);
        $.ajax({
          url: '/api/payments', method: 'POST',
          headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
          data: JSON.stringify({ booking_id: res.id, amount: res.total_amount, mode: 'card', status: 'pending' })
        });
        $('#bookingForm')[0].reset();
        loadBookings($('#filterDate').val());
      },
      error: (xhr) => showMessage($('#msg'), xhr.responseJSON?.error || 'Error', 'error')
    });
  });

  $('#filterDate').on('change', function () { loadBookings($(this).val()); });

  loadShows();
  loadBookings();
});