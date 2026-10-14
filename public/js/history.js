$(function () {
  requireAuth();
  renderHeader('history.html');

  function loadMovies() {
    $.ajax({
      url: '/api/movies',
      success: function (rows) {
        const sel = $('#movie_id').empty().append('<option value="">Select Movie</option>');
        rows.forEach(m => sel.append(`<option value="${m.id}">${m.title}</option>`));
      }
    });
  }

  function loadHistory() {
    $.ajax({
      url: '/api/history',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function (rows) {
        const tbody = $('#historyTable tbody').empty();
        rows.forEach(h => {
          tbody.append(`
            <tr>
              <td>${h.id}</td><td>${h.guest_email}</td><td>${h.movie_title}</td>
              <td>${h.watched_on.toString().split('T')[0]}</td>
              <td>${'★'.repeat(h.rating || 0)}</td>
              <td>${h.review || ''}</td>
              <td><button class="btn danger" onclick="deleteHistory(${h.id})">Delete</button></td>
            </tr>
          `);
        });
      }
    });
  }

  window.deleteHistory = function (id) {
    if (!confirm('Delete this entry?')) return;
    $.ajax({
      url: '/api/history/' + id, method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: loadHistory
    });
  };

  $('#historyForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      guest_email: $('#guest_email').val(),
      movie_id: $('#movie_id').val(),
      watched_on: $('#watched_on').val(),
      rating: $('#rating').val(),
      review: $('#review').val()
    };
    $.ajax({
      url: '/api/history', method: 'POST',
      headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      data: JSON.stringify(payload),
      success: () => {
        showMessage($('#msg'), 'History entry added!');
        $('#historyForm')[0].reset();
        loadHistory();
      },
      error: (xhr) => showMessage($('#msg'), xhr.responseJSON?.error || 'Error', 'error')
    });
  });

  loadMovies();
  loadHistory();
});