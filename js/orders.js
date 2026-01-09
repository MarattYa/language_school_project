// orders.js
import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

// Создание заявки
export async function createOrder(orderData) {
    return await apiPost('/orders', orderData);
}

// Получение всех заявок пользователя
export async function getOrders() {
    try {
        return await apiGet('/orders');
    } catch (error) {
        console.error('Ошибка получения заявок:', error);
        return [];
    }
}

// Обновление заявки
export async function updateOrder(id, orderData) {
    return await apiPut(`/orders/${id}`, orderData);
}

// Удаление заявки
export async function deleteOrder(id) {
    try {
        await apiDelete(`/orders/${id}`);
        return true;
    } catch (error) {
        console.error('Ошибка удаления заявки:', error);
        return false;
    }
}