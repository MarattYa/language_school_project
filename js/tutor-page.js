import { apiGet } from './api.js';

const params = new URLSearchParams(window.location.search);
const tutorId = Number(params.get('id'));

if (!tutorId) {
    alert('Репетитор не найден');
    throw new Error('Tutor ID not provided');
}

const nameEl = document.getElementById('tutor-name');
const languagesEl = document.getElementById('tutor-languages');
const levelEl = document.getElementById('tutor-level');
const experienceEl = document.getElementById('tutor-experience');
const priceEl = document.getElementById('tutor-price');
const descriptionEl = document.getElementById('tutor-description');
const coursesListEl = document.getElementById('tutor-courses');
const courseSelectEl = document.getElementById('course-select');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const tutor = await apiGet('/courses');
        const tutorCourses = filterTutorCourses(courses,tutor);

        renderCourses(tutorCourses);
        fillCourseSelect(tutorCourses);
    } catch(error) {
        console.error(error);
        alert('Ошибка загрузки');
    }
});

// рендер репетитора

function renderTutor(tutor){
    nameEl.textContent = tutor.name;
    languagesEl.textContent = tutor.languages_offered.join(', ');
    levelEl.textContent = tutor.language_level;
    experienceEl.textContent = tutor.work_experience;
    priceEl.textContent = tutor.price_per_hour;

    descriptionEl.textContent = 
        tutor.description || 'Опытный преподаватель иностранных яызков.';
}

// filter курсов репетитора

function filterTutorCourses(courses,tutor){
    return courses.filter(course => 
        tutor.languages_offered.includes(course.language)
    );
}

// render courses

function renderCourses(courses){
    coursesListEl.innerHTML = '';

    if(courses.length === 0) {
        coursesListEl.innerHTML =
            '<li class="list-group-item text-muted">Нет доступных курсов</li>';
        return;
    }

    courses.forEach(course => {
        coursesListEl.insertAdjacentHTML('beforeend', `
            <li class="list-group-item">
                <strong>${course.name}</strong><br>
                <span class="text-muted">
                    Уровень: ${course.level},
                    Длительность: ${course.total_length} недель
                </span>
            </li>
        `);
    });
}

// Заполнение select

function fillCourseSelect(courses) {
    courseSelectEl.innerHTML = 
        '<option value="">Выберите курс</option>';

    courses.forEach(course => {
        courseSelectEl.insertAdjacentHTML('beforeend',`
            <option value="${course.id}">
                ${course.name}
            </option>
        `);
    });
}

document
    .getElementById('tutor-order-form')
    .addEventListener('submit', e => {
        e.preventDefault();

        const orderData = {
            tutorId,
            courseId: courseSelectEl.ariaValueMax,
            name: e.target[1].value,
            email: e.target[2].value,
            phone: e.target[3].value
        };

        console.log('Заявка: ', orderData);

        alert('Заявка отправлена (демо)');
        e.target.removeEventListener();
    });