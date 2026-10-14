function showMessage(container, text, type = 'success') {
  const div = document.createElement('div');
  div.className = 'message ' + type;
  div.textContent = text;
  container.prepend(div);
  setTimeout(() => div.remove(), 3500);
}

function renderHeader(activePage = '') {
  const username = localStorage.getItem('username') || 'User';
  const navLinks = [
    ['dashboard.html', 'Dashboard'],
    ['movies.html', 'Movies'],
    ['shows.html', 'Shows'],
    ['bookings.html', 'Bookings'],
    ['history.html', 'Watch History'],
    ['payments.html', 'Payments']
  ];
  const headerHtml = `
    <header>
      <h1>🎬 Movie Booking System</h1>
      <div class="user-info">
        Welcome, <strong>${username}</strong>
        <button onclick="logout()">Logout</button>
      </div>
    </header>
    <nav>
      ${navLinks.map(([href, label]) =>
        `<a href="${href}" class="${activePage === href ? 'active' : ''}">${label}</a>`
      ).join('')}
    </nav>
  `;
  const mount = document.getElementById('app-header');
  if (mount) mount.innerHTML = headerHtml;
}