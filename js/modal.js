// modal.js
import { createOrder, updateOrder } from './orders.js';
import { showNotification } from './notifications.js';

let currentOrderId = null;
let selectedCourse = null;
let selectedTutor = null;

export function showOrderModal(data) {
    const modal = new bootstrap.Modal(document.getElementById('orderModal'));
    const form = document.getElementById('orderForm');
    
    // Сбрасываем форму
    form.reset();
    currentOrderId = null;
    selectedCourse = data.type === 'course' ? data.data : null;
    selectedTutor = data.type === 'tutor' ? data.data : null;
    
    // Заполняем поля
    if (selectedCourse) {
        document.getElementById('courseName').value = selectedCourse.name;
        document.getElementById('courseTeacher').value = selectedCourse.teacher;
        document.getElementById('courseDuration').value = 
            `${selectedCourse.total_length} недель`;
        
        // Заполняем даты начала
        const dateSelect = document.getElementById('startDate');
        dateSelect.innerHTML = selectedCourse.start_dates
            .map(date => `<option value="${date}">${new Date(date).toLocaleDateString()}</option>`)
            .join('');
    }
    
    if (selectedTutor) {
        document.getElementById('tutorName').value = selectedTutor.name;
        document.getElementById('tutorPrice').value = 
            `${selectedTutor.price_per_hour} ₽/час`;
    }
    
    // Рассчитываем стоимость
    calculateTotalPrice();
    
    // Показываем модальное окно
    modal.show();
}

export function showEditModal(order) {
    const modal = new bootstrap.Modal(document.getElementById('orderModal'));
    const form = document.getElementById('orderForm');
    
    // Заполняем форму данными заказа
    currentOrderId = order.id;
    
    // Преобразуем поля заказа в форму
    document.getElementById('courseName').value = order.course_name || '';
    document.getElementById('startDate').value = order.date_start;
    document.getElementById('startTime').value = order.time_start;
    document.getElementById('studentsNumber').value = order.persons;
    
    // Чекбоксы опций
    const options = [
        'early_registration', 'group_enrollment', 'intensive_course',
        'supplementary', 'personalized', 'excursions', 
        'assessment', 'interactive'
    ];
    
    options.forEach(option => {
        const checkbox = document.getElementById(option);
        if (checkbox) {
            checkbox.checked = order[option] === true;
        }
    });
    
    // Рассчитываем стоимость
    calculateTotalPrice();
    
    // Меняем заголовок
    document.querySelector('#orderModal .modal-title').textContent = 'Редактирование заявки';
    
    modal.show();
}

// Обработчик отправки формы
document.getElementById('orderForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        course_id: selectedCourse?.id || 0,
        tutor_id: selectedTutor?.id || 0,
        date_start: formData.get('startDate'),
        time_start: formData.get('startTime'),
        persons: parseInt(formData.get('studentsNumber')),
        duration: selectedCourse?.week_length || 1,
        price: calculateTotalPrice(),
        early_registration: formData.get('early_registration') === 'on',
        group_enrollment: formData.get('group_enrollment') === 'on',
        intensive_course: formData.get('intensive_course') === 'on',
        supplementary: formData.get('supplementary') === 'on',
        personalized: formData.get('personalized') === 'on',
        excursions: formData.get('excursions') === 'on',
        assessment: formData.get('assessment') === 'on',
        interactive: formData.get('interactive') === 'on'
    };
    
    try {
        if (currentOrderId) {
            // Редактирование
            await updateOrder(currentOrderId, orderData);
            showNotification('Заявка успешно обновлена', 'success');
        } else {
            // Создание
            await createOrder(orderData);
            showNotification('Заявка успешно создана', 'success');
        }
        
        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
        modal.hide();
        
        // Обновляем список заявок в личном кабинете
        if (window.location.pathname.includes('account.html')) {
            window.loadOrders(); // Эта функция должна быть в account.js
        }
        
    } catch (error) {
        showNotification(`Ошибка: ${error.message}`, 'danger');
    }
});

// Функция расчёта стоимости
function calculateTotalPrice() {
    const basePrice = selectedCourse?.course_fee_per_hour || selectedTutor?.price_per_hour || 0;
    const duration = parseInt(document.getElementById('courseDuration')?.value) || 1;
    const students = parseInt(document.getElementById('studentsNumber')?.value) || 1;
    
    let total = basePrice * duration * students;
    
    // Применяем множители из чекбоксов
    const options = {
        early_registration: 0.9,       // -10%
        group_enrollment: 0.85,        // -15%
        intensive_course: 1.2,         // +20%
        excursions: 1.25,              // +25%
        interactive: 1.5               // +50%
    };
    
    Object.keys(options).forEach(option => {
        const checkbox = document.getElementById(option);
        if (checkbox?.checked) {
            total *= options[option];
        }
    });
    
    // Добавляем фиксированные суммы
    if (document.getElementById('supplementary')?.checked) {
        total += 2000 * students;
    }
    
    if (document.getElementById('personalized')?.checked) {
        const weeks = duration / (selectedCourse?.week_length || 1);
        total += 1500 * weeks;
    }
    
    if (document.getElementById('assessment')?.checked) {
        total += 300;
    }
    
    // Отображаем стоимость
    const totalElement = document.getElementById('totalPrice');
    if (totalElement) {
        totalElement.textContent = Math.round(total);
    }
    
    return Math.round(total);
}

// Обновляем стоимость при изменении полей
document.querySelectorAll('#orderForm input, #orderForm select').forEach(element => {
    element.addEventListener('change', calculateTotalPrice);
    element.addEventListener('input', calculateTotalPrice);
});