$(function () {
  requireAuth();
  renderHeader('dashboard.html');

  console.log('Dashboard loaded, token:', getToken() ? 'present' : 'missing');

  // Load summary
  $.ajax({
    url: '/api/dashboard/summary',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + getToken() },
    success: function (data) {
      console.log('Summary data:', data);
      $('#totalCustomers').text(data.total_customers || 0);
      $('#totalMovies').text(data.total_movies || 0);
      $('#totalShows').text(data.total_shows || 0);
      $('#todayBookings').text(data.todays_bookings || 0);
      $('#totalRevenue').text('$' + parseFloat(data.total_revenue || 0).toFixed(2));
      $('#pendingPayments').text(data.pending_payments || 0);
    },
    error: function (xhr, status, error) {
      console.error('Summary error:', xhr.status, error, xhr.responseText);
    }
  });

  // Load report
  $.ajax({
    url: '/api/dashboard/report',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + getToken() },
    success: function (rows) {
      console.log('Report data:', rows);
      const tbody = $('#reportTable tbody').empty();

      if (!rows || !rows.length) {
        tbody.append('<tr><td colspan="3" style="text-align:center; padding:20px;">No data available</td></tr>');
        return;
      }

      rows.forEach(function (r) {
        tbody.append(
          '<tr>' +
            '<td>' + (r.title || '-') + '</td>' +
            '<td>' + (r.bookings || 0) + '</td>' +
            '<td>$' + parseFloat(r.revenue || 0).toFixed(2) + '</td>' +
          '</tr>'
        );
      });
    },
    error: function (xhr, status, error) {
      console.error('Report error:', xhr.status, error, xhr.responseText);
    }
  });

  // Export CSV
  $('#exportBtn').on('click', function () {
    $.ajax({
      url: '/api/dashboard/report',
      headers: { 'Authorization': 'Bearer ' + getToken() },
      success: function (rows) {
        let csv = 'Movie,Bookings,Revenue\n';
        rows.forEach(function (r) {
          csv += '"' + (r.title || '') + '",' + (r.bookings || 0) + ',' + (r.revenue || 0) + '\n';
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'movie-report.csv';
        a.click();
      }
    });
  });
});