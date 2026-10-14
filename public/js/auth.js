function getToken() {
  return localStorage.getItem('token');
}
function setToken(token) { localStorage.setItem('token', token); }
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
}

function authHeaders() {
  const t = getToken();
  return t ? { 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

function requireAuth() {
  if (!getToken()) { window.location.href = 'login.html'; }
}

function logout() {
  clearAuth();
  fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
    window.location.href = 'login.html';
  });
}