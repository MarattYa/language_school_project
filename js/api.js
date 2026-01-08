const API_KEY = 'fa539060-cd45-4c8b-bfcd-db8592ca8e11';
const BASE_URL = 'http://exam-api-courses.std-900.ist.mospolytech.ru/api';

async function  apiGet(endpoint) {
    const response = await fetch(
        `${BASE_URL}${endpoint}?api_key=${API_KEY}`
    );

    if(!response.ok) {
        throw new Error('Ошибка при запросе к API');
    }

    return response.json();


}