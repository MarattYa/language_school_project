export const API_KEY = 'fa539060-cd45-4c8b-bfcd-db8592ca8e11';
export const BASE_URL = 'http://exam-api-courses.std-900.ist.mospolytech.ru/api';

export async function apiGet(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
    
    if (!response.ok) {
        throw new Error('Ошибка при запросе к API');
    }

    return await response.json();
}

export async function apiPost(endpoint, data) {
  const response = await fetch(
    `${BASE_URL}${endpoint}?api_key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }
  );

  if (!response.ok) {
    throw new Error('Ошибка POST-запроса');
  }

  return response.json();
}