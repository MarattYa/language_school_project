export const API_KEY = 'fa539060-cd45-4c8b-bfcd-db8592ca8e11';
export const BASE_URL = 'http://exam-api-courses.std-900.ist.mospolytech.ru/api';

export async function apiRequest(endpoint, method = 'GET', data = null) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', API_KEY);
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
}

// Специализированные функции
export const apiGet = (endpoint) => apiRequest(endpoint, 'GET');
export const apiPost = (endpoint, data) => apiRequest(endpoint, 'POST', data);
export const apiPut = (endpoint, data) => apiRequest(endpoint, 'PUT', data);
export const apiDelete = (endpoint) => apiRequest(endpoint, 'DELETE');