$(function () {
  requireAuth();
  renderHeader('shows.html');
  let editingId = null;

  function loadMoviesIntoSelect() {
    $.ajax({
      url: '/api/movies',
      success: function (rows) {
        const sel = $('#movie_id').empty().append('<option value="">Select Movie</option>');
        rows.forEach(m => sel.append(`<option value="${m.id}">${m.title}</option>`));
      }
    });
  }

  function loadShows() {
    $.ajax({
      url: '/api/shows',
      success: function (rows) {
        const tbody = $('#showsTable tbody').empty();
        rows.forEach(s => {
          const d = (s.show_date || '').toString().split('T')[0];
          tbody.append(`
            <tr>
              <td>${s.id}</td><td>${s.movie_title}</td><td>${s.screen_name}</td>
              <td>${d}</td><td>${s.show_time}</td>
              <td>$${parseFloat(s.ticket_price).toFixed(2)}</td>
              <td>${s.available_seats}/${s.total_seats}</td>
              <td>
                <button class="btn warn" onclick='editShow(${JSON.stringify(s)})'>Edit</button>
                <button class="btn danger" onclick="deleteShow(${s.id})">Delete</button>
              </td>
            </tr>
          `);
        });
      }
    });
  }

  window.editShow = function (s) {
    editingId = s.id;
    $('#movie_id').val(s.movie_id);
    $('#screen_name').val(s.screen_name);
    $('#show_date').val(s.show_date.split('T')[0]);
    $('#show_time').val(s.show_time);
    $('#ticket_price').val(s.ticket_price);
    $('#total_seats').val(s.total_seats);
  };

  window.deleteShow = function (id) {
    if (!confirm('Delete this show?')) return;
    $.ajax({
      url: '/api/shows/' + id, method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: loadShows
    });
  };

  $('#showForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      movie_id: $('#movie_id').val(),
      screen_name: $('#screen_name').val(),
      show_date: $('#show_date').val(),
      show_time: $('#show_time').val(),
      ticket_price: $('#ticket_price').val(),
      total_seats: $('#total_seats').val()
    };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? '/api/shows/' + editingId : '/api/shows';
    $.ajax({
      url, method,
      headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      data: JSON.stringify(payload),
      success: () => {
        showMessage($('#msg'), 'Show saved!');
        editingId = null;
        $('#showForm')[0].reset();
        loadShows();
      },
      error: (xhr) => showMessage($('#msg'), xhr.responseJSON?.error || 'Error', 'error')
    });
  });

  loadMoviesIntoSelect();
  loadShows();
});