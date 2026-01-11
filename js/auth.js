export function initLogout() {
  document.getElementById('logout')?.addEventListener('click', () => {
    localStorage.removeItem('api_key');
    window.location.href = 'login.html';
  });
}