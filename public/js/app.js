function showMessage(container, text, type) {
  type = type || 'success';
  const div = document.createElement('div');
  div.className = 'message ' + type;
  div.textContent = text;
  if (container && container.prepend) {
    container.prepend(div);
  }
  setTimeout(function () { div.remove(); }, 3500);
}

function renderHeader(activePage) {
  activePage = activePage || '';
  const username = localStorage.getItem('username') || 'User';

  const navLinks = [
    ['dashboard.html', 'Dashboard'],
    ['movies.html', 'Movies'],
    ['shows.html', 'Shows'],
    ['seats.html', 'Seat Availability'],
    ['customers.html', 'Customers'],
    ['bookings.html', 'Bookings'],
    ['payments.html', 'Payments']
  ];

  let navHtml = '';
  navLinks.forEach(function (item) {
    const cls = (activePage === item[0]) ? 'active' : '';
    navHtml += '<a href="' + item[0] + '" class="' + cls + '">' + item[1] + '</a>';
  });

  const headerHtml =
    '<header>' +
      '<h1>🎬 Movie Booking System</h1>' +
      '<div class="user-info">' +
        'Welcome, <strong>' + username + '</strong>' +
        '<button onclick="logout()">Logout</button>' +
      '</div>' +
    '</header>' +
    '<nav>' + navHtml + '</nav>';

  const mount = document.getElementById('app-header');
  if (mount) mount.innerHTML = headerHtml;
}