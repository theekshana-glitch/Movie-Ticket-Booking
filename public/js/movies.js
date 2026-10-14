$(function () {
  requireAuth();
  renderHeader('movies.html');

  let editingId = null;

  function loadMovies() {
    $.ajax({
      url: '/api/movies',
      success: function (rows) {
        const tbody = $('#moviesTable tbody').empty();
        rows.forEach(m => {
          tbody.append(`
            <tr>
              <td>${m.id}</td>
              <td>${m.title}</td>
              <td>${m.genre}</td>
              <td>${m.language}</td>
              <td>${m.duration_minutes} min</td>
              <td>${m.rating}</td>
              <td>
                <button class="btn warn" onclick='editMovie(${JSON.stringify(m)})'>Edit</button>
                <button class="btn danger" onclick="deleteMovie(${m.id})">Delete</button>
              </td>
            </tr>
          `);
        });
      }
    });
  }

  window.editMovie = function (m) {
    editingId = m.id;
    $('#title').val(m.title);
    $('#genre').val(m.genre);
    $('#language').val(m.language);
    $('#duration').val(m.duration_minutes);
    $('#rating').val(m.rating);
    $('#release_date').val(m.release_date ? m.release_date.split('T')[0] : '');
    $('#description').val(m.description);
  };

  window.deleteMovie = function (id) {
    if (!confirm('Delete this movie?')) return;
    $.ajax({
      url: '/api/movies/' + id,
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + getToken() },
      success: function () { loadMovies(); }
    });
  };

  $('#movieForm').on('submit', function (e) {
    e.preventDefault();
    const payload = {
      title: $('#title').val(),
      genre: $('#genre').val(),
      language: $('#language').val(),
      duration_minutes: $('#duration').val(),
      rating: $('#rating').val(),
      release_date: $('#release_date').val() || null,
      description: $('#description').val(),
      poster_url: ''
    };
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? '/api/movies/' + editingId : '/api/movies';

    $.ajax({
      url, method,
      headers: { Authorization: 'Bearer ' + getToken(), 'Content-Type': 'application/json' },
      data: JSON.stringify(payload),
      success: function () {
        showMessage($('#msg'), 'Movie saved!', 'success');
        editingId = null;
        $('#movieForm')[0].reset();
        loadMovies();
      },
      error: function (xhr) { showMessage($('#msg'), xhr.responseJSON?.error || 'Error', 'error'); }
    });
  });

  loadMovies();
});