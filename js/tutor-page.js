import { apiGet } from './api.js';
import { createOrder } from './orders.js';

const params = new URLSearchParams(window.location.search);
const tutorId = Number(params.get('id'));
if(!tutorId) { alert('Репетитор не найден'); throw new Error('Tutor ID missing'); }

const nameEl = document.getElementById('tutor-name');
const languagesEl = document.getElementById('tutor-languages');
const levelEl = document.getElementById('tutor-level');
const experienceEl = document.getElementById('tutor-experience');
const priceEl = document.getElementById('tutor-price');
const descriptionEl = document.getElementById('tutor-description');
const coursesListEl = document.getElementById('tutor-courses');
const courseSelectEl = document.getElementById('course-select');

document.addEventListener('DOMContentLoaded', async ()=>{
    try{
        const tutor = await apiGet(`/tutors/${tutorId}`);
        renderTutor(tutor);

        const allCourses = await apiGet('/courses');
        const tutorCourses = allCourses.filter(c => tutor.languages_offered.includes(c.language));

        renderCourses(tutorCourses);
        fillCourseSelect(tutorCourses);
    }catch(err){
        console.error(err);
        alert('Ошибка загрузки');
    }
});

function renderTutor(tutor){
    nameEl.textContent = tutor.name;
    languagesEl.textContent = tutor.languages_offered.join(', ');
    levelEl.textContent = tutor.language_level;
    experienceEl.textContent = tutor.work_experience;
    priceEl.textContent = tutor.price_per_hour;
    descriptionEl.textContent = tutor.description || 'Описание отсутствует';
}

function renderCourses(courses){
    coursesListEl.innerHTML = '';
    if(courses.length===0) {
        coursesListEl.innerHTML = '<li class="list-group-item text-muted">Нет доступных курсов</li>';
        return;
    }
    courses.forEach(c=>{
        coursesListEl.insertAdjacentHTML('beforeend',`
            <li class="list-group-item">
                <a href="course.html?id=${c.id}"><strong>${c.name}</strong></a> — Уровень: ${c.level}, Длительность: ${c.total_length} недель
            </li>
        `);
    });
}

function fillCourseSelect(courses){
    courseSelectEl.innerHTML = '<option value="">Выберите курс</option>';
    courses.forEach(c=>{
        courseSelectEl.insertAdjacentHTML('beforeend', `<option value="${c.id}">${c.name}</option>`);
    });
}

document.getElementById('tutor-order-form').addEventListener('submit', async e=>{
    e.preventDefault();
    const form = e.target;

    const orderData = {
        tutor_id: tutorId,
        course_id: Number(courseSelectEl.value),
        customer_name: form[1].value,
        customer_email: form[2].value,
        customer_phone: form[3].value
    };

    const result = await createOrder(orderData);
    if(result){
        alert('Заявка отправлена');
        form.reset();
    }else{
        alert('Ошибка при отправке заявки');
    }
});
