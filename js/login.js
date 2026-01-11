const form = document.getElementById('login-form');
const input = document.getElementById('api-key-input');

form.addEventListener('submit', e => {
  e.preventDefault();

  const apiKey = input.value.trim();

  if (!apiKey) {
    alert('Введите API Key');
    return;
  }

  // Сохраняем ключ
  localStorage.setItem('api_key', apiKey);

  // Переход на главную
  window.location.href = 'index.html';
});
