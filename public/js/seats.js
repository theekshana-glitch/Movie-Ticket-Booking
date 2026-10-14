$(function () {
  if (!requireAuth()) return;
  renderHeader('seats.html');

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function loadSeats(date) {
    date = date || '';
    const url = '/api/seats' + (date ? '?date=' + date : '');
    console.log('Loading seats from:', url);

    $.ajax({
      url: url,
      method: 'GET',
      success: function (rows) {
        console.log('Seats loaded:', rows.length);
        const tbody = $('#seatsTable tbody').empty();

        if (!rows.length) {
          tbody.append('<tr><td colspan="10" style="text-align:center; padding:20px;">No shows found</td></tr>');
          return;
        }

        rows.forEach(function (s) {
          const total = s.total_seats || 0;
          const available = s.available_seats || 0;
          const booked = s.booked_seats || 0;
          const pct = total > 0 ? ((booked / total) * 100).toFixed(1) : 0;
          const barColor = pct > 80 ? '#e74c3c' : pct > 50 ? '#f39c12' : '#27ae60';
          const d = s.show_date ? s.show_date.toString().split('T')[0] : '';

          tbody.append(
            '<tr>' +
              '<td>' + s.id + '</td>' +
              '<td>' + escapeHtml(s.movie_title) + '</td>' +
              '<td>' + s.screen_name + '</td>' +
              '<td>' + d + '</td>' +
              '<td>' + s.show_time + '</td>' +
              '<td>$' + parseFloat(s.ticket_price).toFixed(2) + '</td>' +
              '<td>' + total + '</td>' +
              '<td>' + booked + '</td>' +
              '<td><strong style="color:' + (available > 10 ? '#27ae60' : '#e74c3c') + ';">' + available + '</strong></td>' +
              '<td>' +
                '<div style="background:#eee; border-radius:4px; overflow:hidden; width:100px;">' +
                  '<div style="width:' + pct + '%; background:' + barColor + '; height:8px;"></div>' +
                '</div>' +
                '<small>' + pct + '%</small>' +
              '</td>' +
            '</tr>'
          );
        });
      },
      error: function (xhr, status, err) {
        console.error('Seats load error:', xhr.status, err);
        $('#seatsTable tbody').html(
          '<tr><td colspan="10" style="text-align:center; padding:20px; color:#e74c3c;">Error loading seats. Please refresh or login again.</td></tr>'
        );
      }
    });
  }

  $('#filterDate').on('change', function () {
    loadSeats($(this).val());
  });

  $('#clearFilter').on('click', function () {
    $('#filterDate').val('');
    loadSeats();
  });

  loadSeats();
});