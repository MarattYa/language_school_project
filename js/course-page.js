import { apiGet } from './api.js';
import { createOrder } from './orders.js';

/* ================== ID курса ================== */
const params = new URLSearchParams(window.location.search);
const courseId = Number(params.get('id'));

if (!courseId) {
  alert('Курс не найден');
  throw new Error('Course ID missing');
}

/* ================== DOM ================== */
const nameEl = document.getElementById('course-name');
const descEl = document.getElementById('course-description');
const languageEl = document.getElementById('course-language');
const levelEl = document.getElementById('course-level');
const durationEl = document.getElementById('course-duration');
const weekLengthEl = document.getElementById('course-week-length');

const openModalBtn = document.getElementById('open-order-modal');
const modalCourseNameEl = document.getElementById('modal-course-name');
const orderForm = document.getElementById('order-form');

let currentCourse = null;
let orderModal = null;

/* ================== Загрузка курса ================== */
document.addEventListener('DOMContentLoaded', async () => {
    orderModal = new bootstrap.Modal(
        document.getElementById('orderModal')
    );
    
    try {
        const course = await apiGet(`/courses/${courseId}`);
        currentCourse = course;

        nameEl.textContent = course.name;
        descEl.textContent = course.description || 'Описание отсутствует';
        languageEl.textContent = course.language;
        levelEl.textContent = course.level;
        durationEl.textContent = course.total_length;
        weekLengthEl.textContent = course.week_length;
    } catch (err) {
        console.error(err);
        alert('Ошибка загрузки курса');
    }
});

/* ================== Открытие модалки ================== */
openModalBtn.addEventListener('click', () => {
  modalCourseNameEl.value = currentCourse.name;
  orderModal.show();
});

/* ================== Отправка заявки ================== */
orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const orderData = {
    course_id: currentCourse.id,
    tutor_id: 0,

    date_start: document.getElementById('start-date').value,
    time_start: document.getElementById('lesson-time').value,

    persons: Number(document.getElementById('students-number').value),

    duration:
      currentCourse.total_length *
      currentCourse.week_length,

    price:
      currentCourse.course_fee_per_hour *
      currentCourse.total_length *
      currentCourse.week_length,

    early_registration: false,
    group_enrollment: false,
    intensive_course: false,
    supplementary: false,
    personalized: false,
    excursions: false,
    assessment: false,
    interactive: false
  };

  try {
    await createOrder(orderData);
    alert('Заявка успешно отправлена');
    orderForm.reset();
    orderModal.hide();
  } catch (error) {
    console.error(error);
    alert('Ошибка при отправке заявки');
  }
});