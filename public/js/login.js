$(function () {
  if (getToken()) window.location.href = 'dashboard.html';

  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    const username = $('#username').val().trim();
    const password = $('#password').val().trim();

    $.ajax({
      url: '/api/auth/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ username, password }),
      success: function (res) {
        setToken(res.token);
        localStorage.setItem('username', res.username);
        localStorage.setItem('role', res.role);
        window.location.href = 'dashboard.html';
      },
      error: function (xhr) {
        $('#msg').removeClass('success').addClass('error')
          .text(xhr.responseJSON?.error || 'Login failed');
      }
    });
  });
});