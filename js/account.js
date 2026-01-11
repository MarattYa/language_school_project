import { apiGet, apiPut, apiDelete } from './api.js';

const ordersListEl = document.getElementById('orders-list');
const editModalEl = document.getElementById('editOrderModal');
const editForm = document.getElementById('edit-order-form');

let editModal = null;
let currentOrders = [];

// Проверка авторизации
if (!localStorage.getItem('api_key')) {
  window.location.href = 'login.html';
}

// Инициализация модального окна и загрузка заявок
document.addEventListener('DOMContentLoaded', async () => {
  if (editModalEl) {
    editModal = new bootstrap.Modal(editModalEl);
  }

  await loadOrders();
});

// Загрузка заявок с сервера
async function loadOrders() {
  try {
    const orders = await apiGet('/orders');
    currentOrders = orders;

    const courseIds = [...new Set(orders.map(o => o.course_id).filter(Boolean))];
    const tutorIds = [...new Set(orders.map(o => o.tutor_id).filter(Boolean))];

    const coursesMap = {};
    const tutorsMap = {};

    await Promise.all(courseIds.map(async id => {
      try {
        const course = await apiGet(`/courses/${id}`);
        coursesMap[id] = course;
      } catch {
        coursesMap[id] = { name: 'Не найден' };
      }
    }));

    await Promise.all(tutorIds.map(async id => {
      try {
        const tutor = await apiGet(`/tutors/${id}`);
        tutorsMap[id] = tutor;
      } catch {
        tutorsMap[id] = { name: 'Не найден' };
      }
    }));

    // **Передаём карты в рендер**
    renderOrders(orders, coursesMap, tutorsMap);

  } catch (err) {
    console.error('Ошибка загрузки заявок:', err);
    ordersListEl.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Ошибка загрузки заявок</td></tr>`;
  }
}

// Рендер таблицы
function renderOrders(orders, coursesMap, tutorsMap) {
  ordersListEl.innerHTML = '';

  if (!orders.length) {
    ordersListEl.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Нет заявок</td></tr>`;
    return;
  }

  orders.forEach(order => {
    const courseOrTutor = order.course_id
      ? coursesMap[order.course_id]?.name || '-'
      : order.tutor_id
      ? tutorsMap[order.tutor_id]?.name || '-'
      : '-';

    const price = order.price || '-';
    const dateStart = order.date_start || '-';
    const timeStart = order.time_start || '-';
    const persons = order.persons || '-';
    const duration = order.duration || '-';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${courseOrTutor}</td>
      <td>${price}</td>
      <td>${dateStart}</td>
      <td>${timeStart}</td>
      <td>${persons}</td>
      <td>${duration}</td>
      <td>
        <button class="btn btn-sm btn-primary edit-btn" data-id="${order.id}">Редактировать</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${order.id}">Удалить</button>
      </td>
    `;
    ordersListEl.appendChild(tr);
  });

  // Обработчики кнопок
  ordersListEl.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(Number(btn.dataset.id)));
  });
  ordersListEl.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteOrder(Number(btn.dataset.id)));
  });
}

// Открытие модалки редактирования
function openEditModal(orderId) {
  const order = currentOrders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById('edit-order-id').value = order.id;
  document.getElementById('edit-date-start').value = order.date_start || '';
  document.getElementById('edit-time-start').value = order.time_start || '';
  document.getElementById('edit-students-number').value = order.persons || 1;

  editModal.show();
}

// Обновление заявки
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const orderId = Number(document.getElementById('edit-order-id').value);
  const updatedData = {
    date_start: document.getElementById('edit-date-start').value,
    time_start: document.getElementById('edit-time-start').value,
    persons: Number(document.getElementById('edit-students-number').value)
  };

  try {
    await apiPut(`/orders/${orderId}`, updatedData);
    editModal.hide();
    await loadOrders();
  } catch (err) {
    console.error('Ошибка при обновлении заявки:', err);
    alert('Ошибка при обновлении заявки');
  }
});

// Удаление заявки
async function deleteOrder(orderId) {
  if (!confirm('Вы уверены, что хотите удалить эту заявку?')) return;

  try {
    await apiDelete(`/orders/${orderId}`);
    await loadOrders();
  } catch (err) {
    console.error('Ошибка при удалении заявки:', err);
    alert('Ошибка при удалении заявки');
  }
}
