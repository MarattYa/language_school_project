export const BASE_URL =
  'http://exam-api-courses.std-900.ist.mospolytech.ru/api';

function getApiKey() {
  const key = localStorage.getItem('api_key');
  if (!key) {
    throw new Error(
      'Для получения доступа к API необходимо пройти процедуру авторизации.'
    );
  }
  return key;
}

export async function apiGet(endpoint) {
  const apiKey = getApiKey();

  const response = await fetch(
    `${BASE_URL}${endpoint}?api_key=${apiKey}`
  );

  if (!response.ok) {
    const err = await response.json();
    throw err;
  }

  return response.json();
}

export async function apiPost(endpoint, data) {
  const apiKey = getApiKey();

  const response = await fetch(
    `${BASE_URL}${endpoint}?api_key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw err;
  }

  return response.json();
}

export async function apiPut(endpoint, data) {
  const apiKey = getApiKey();

  const response = await fetch(
    `${BASE_URL}${endpoint}?api_key=${apiKey}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw err;
  }

  return response.json();
}

export async function apiDelete(endpoint) {
  const apiKey = getApiKey();

  const response = await fetch(
    `${BASE_URL}${endpoint}?api_key=${apiKey}`,
    { method: 'DELETE' }
  );

  if (!response.ok) {
    const err = await response.json();
    throw err;
  }

  return response.json();
}
