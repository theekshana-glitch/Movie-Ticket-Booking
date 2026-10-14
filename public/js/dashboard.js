$(function () {
  requireAuth();
  renderHeader('dashboard.html');

  $.ajax({
    url: '/api/dashboard/summary',
    headers: { Authorization: 'Bearer ' + getToken() },
    success: function (data) {
      $('#totalMovies').text(data.total_movies);
      $('#totalShows').text(data.total_shows);
      $('#todayBookings').text(data.todays_bookings);
      $('#totalRevenue').text('$' + parseFloat(data.total_revenue).toFixed(2));
      $('#pendingPayments').text(data.pending_payments);
    }
  });

  $.ajax({
    url: '/api/dashboard/report',
    headers: { Authorization: 'Bearer ' + getToken() },
    success: function (rows) {
      const tbody = $('#reportTable tbody').empty();
      rows.forEach(r => {
        tbody.append(`
          <tr>
            <td>${r.title}</td>
            <td>${r.bookings}</td>
            <td>$${parseFloat(r.revenue).toFixed(2)}</td>
          </tr>
        `);
      });
    }
  });

  $('#exportBtn').on('click', function () {
    $.ajax({
      url: '/api/dashboard/report',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        let csv = 'Movie,Bookings,Revenue\n';
        rows.forEach(r => { csv += `"${r.title}",${r.bookings},${r.revenue}\n`; });
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'report.csv';
        a.click();
      }
    });
  });
});