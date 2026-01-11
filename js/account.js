import { apiGet, apiPost } from './api.js';

// DOM
const ordersListEl = document.getElementById('orders-list');
const editForm = document.getElementById('edit-order-form');
const editModalEl = document.getElementById('editOrderModal');

let editModal = null;

// Загружаем заявки и показываем в таблице
export async function loadOrders() {
  try {
    const orders = await apiGet('/orders'); // Получаем все заявки
    renderOrders(orders);
  } catch (err) {
    console.error('Ошибка загрузки заказов:', err);
  }
}

// Рендер таблицы
function renderOrders(orders) {
  ordersListEl.innerHTML = '';

  if (!orders.length) {
    ordersListEl.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">Нет заявок</td>
      </tr>
    `;
    return;
  }

  orders.forEach(order => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order.course?.name || '-'}</td>
      <td>${order.customer_name}</td>
      <td>${order.customer_email}</td>
      <td>${order.status}</td>
      <td>
        <button class="btn btn-sm btn-primary edit-btn" data-id="${order.id}">
          Редактировать
        </button>
      </td>
    `;
    ordersListEl.appendChild(tr);
  });

  // Навешиваем события на кнопки редактирования
  ordersListEl.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const orderId = btn.dataset.id;
      const order = orders.find(o => o.id == orderId);
      if (!order) return;

      document.getElementById('edit-order-id').value = order.id;
      document.getElementById('edit-user-name').value = order.customer_name;
      document.getElementById('edit-user-email').value = order.customer_email;
      document.getElementById('edit-course-name').value = order.course?.name || '';
      document.getElementById('edit-status').value = order.status;

      editModal.show();
    });
  });
}

// Редактирование заявки
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const orderId = document.getElementById('edit-order-id').value;
  const updatedData = {
    customer_name: document.getElementById('edit-user-name').value.trim(),
    customer_email: document.getElementById('edit-user-email').value.trim(),
    status: document.getElementById('edit-status').value
  };

  try {
    await apiPost(`/orders/${orderId}`, updatedData); // обновляем заявку
    alert('Заявка обновлена');
    editModal.hide();
    loadOrders(); // перерисовываем таблицу
  } catch (err) {
    console.error(err);
    alert('Ошибка при обновлении заявки');
  }
});

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  if (editModalEl) {
    editModal = new bootstrap.Modal(editModalEl);
  }

  loadOrders();
});
