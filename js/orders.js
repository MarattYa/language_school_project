import {API_KEY,BASE_URL, apiGet,apiPost} from './api.js'

// Create (Создание заявки)
export async function createOrder(orderData) {
  return await apiPost('/orders', orderData);
}

// Read
export async function getOrders() {
    try {
        return await apiGet('/orders');
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Update
export async function updateOrder(id, orderData){
    try {
        const response = await fetch(`${BASE_URL}/orders/${id}?api_key=${API_KEY}`, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(orderData)
        });
        if(!response.ok) throw new Error('Ошибка при обновлении заказа');
        return await response.json(); 
    } catch(error) {
        console.error(error);
        return null;
    }
}

// Delete
export async function deleteOrder(id) {
    try {
        const response = await fetch(`${BASE_URL}/orders/${id}?api_key=${API_KEY}`, {
            method: 'DELETE',
        });
        if(!response.ok) throw new Error('Ошибка при удалении заявки');
        return true;
    } catch (error) {
        console.error(error)
        return false;
    }
}

