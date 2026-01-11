import { apiPost } from './api.js';

export async function createOrder(orderData) {
  try {
    return await apiPost('/orders', orderData);
  } catch (error) {
    console.error(error);
    return null;
  }
}
