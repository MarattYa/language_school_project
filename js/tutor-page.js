import { apiGet } from './api.js';
import { createOrder } from './orders.js';

const params = new URLSearchParams(window.location.search);
const tutorId = Number(params.get('id'));
if (!tutorId) {
    alert('Репетитор не найден');
    throw new Error('Tutor ID missing');
}

const nameEl = document.getElementById('tutor-name');
const languagesEl = document.getElementById('tutor-languages');
const levelEl = document.getElementById('tutor-level');
const experienceEl = document.getElementById('tutor-experience');
const priceEl = document.getElementById('tutor-price');
const descriptionEl = document.getElementById('tutor-description');
const formEl = document.getElementById('tutor-order-form');

document.addEventListener('DOMContentLoaded', async () => {
    if (!formEl) {
        console.error('Форма заявки не найдена');
        return;
    }

    try {
        const tutor = await apiGet(`/tutors/${tutorId}`);
        renderTutor(tutor);
    } catch (err) {
        console.error('Ошибка загрузки данных репетитора:', err);
        alert('Ошибка загрузки данных репетитора');
    }
});

// Рендер профиля репетитора
function renderTutor(tutor) {
    nameEl.textContent = tutor.name || '-';
    languagesEl.textContent = (tutor.languages_offered || []).join(', ');
    levelEl.textContent = tutor.language_level || '-';
    experienceEl.textContent = tutor.work_experience || '-';
    priceEl.textContent = tutor.price_per_hour || '-';
    descriptionEl.textContent = tutor.description || 'Описание отсутствует';
}

// Обработчик отправки формы
formEl.addEventListener('submit', async e => {
    e.preventDefault();

    const customerName = formEl.querySelector('input[type="text"]').value.trim();
    const customerEmail = formEl.querySelector('input[type="email"]').value.trim();
    const customerPhone = formEl.querySelector('input[type="tel"]').value.trim();

    if (!customerName || !customerEmail || !customerPhone) {
        alert('Заполните все поля');
        return;
    }

    // Минимальные обязательные поля для API
    const orderData = {
        tutor_id: tutorId,
        course_id: 0,  // так как курс не выбран
        date_start: new Date().toISOString().split('T')[0], // сегодняшняя дата YYYY-MM-DD
        time_start: "09:00",  // минимальное время
        duration: 1,          // минимальная продолжительность (часы)
        persons: 1,           // минимум 1 студент
        price: 500,           // можно использовать tutor.price_per_hour, если нужно точнее
        early_registration: false,
        group_enrollment: false,
        intensive_course: false,
        supplementary: false,
        personalized: false,
        excursions: false,
        assessment: false,
        interactive: false,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone
    };

    try {
        const result = await createOrder(orderData);
        if (result) {
            alert('Заявка на репетитора отправлена');
            formEl.reset();
        } else {
            alert('Ошибка при отправке заявки');
        }
    } catch (err) {
        console.error('Ошибка API:', err);
        alert('Ошибка при отправке заявки');
    }
});
