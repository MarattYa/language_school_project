import { apiGet } from './api.js';
import { createOrder } from './orders.js';

const coursesList = document.getElementById('courses-list');
const paginationContainer = document.getElementById('courses-pagination');

let coursesData = []; // Все курсы
let currentPage = 1;
const itemsPerPage = 5;

// html карточки
export function createCourseCard(course) {
    return `
    <div class="col-md-6 col-lg-4 mb-4">
        <div class ="course-card h-100 d-flex flex-column justify-content-between">
            <div>
                <h5 class="fw-bold mb-2">
                    ${course.name}
                </h5>
                
                <p class ="text-muted mb-2">
                    Уровень: ${course.level}
                </p>

                <p class="mb-3">
                    Преподаватель: <strong>${course.teacher}</strong>
                </p>

                <p class="text-muted">
                    Длительность: ${course.total_length} недель - ${course.week_length} ч/нед
                </p>
            </div>

            <button
                class="btn btn-primary w-100 mt-3"
                data-course-id="${course.id}"
                >
                Подать заявку
            </button>
        </div>
    </div>
    `;
}

// Отображение текущей страницы
function renderCurrentPage() {
    coursesList.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = coursesData.slice(start,end);

    pageItems.forEach(course => {
        coursesList.insertAdjacentHTML('beforeend', createCourseCard(course));
    });

    renderPagination();
}

//Рендер пагинации Bootstrap
function renderPagination() {
    paginationContainer.innerHTML= '';
    const totalPages = Math.ceil(coursesData.length/itemsPerPage);

    for(let i = 1; i <= totalPages; i++) {
        const active = i === currentPage ? 'active' : '';
        paginationContainer.insertAdjacentHTML('beforeend',`
            <li class="page-item ${active}">
                <a class="page-link" href="#">${i}</a>
            </li>
            `)
    }

    const pageLinks = paginationContainer.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = parseInt(e.target.textContent);
            renderCurrentPage();
        });
    });
}

// Загрузка курсов из API

export async function loadCourses() {
    try {
        const courses = await apiGet('/courses');
        coursesData = courses;
        renderCurrentPage();
    } catch (error) {
        console.error(error);
    }
}

//Обработчик кнопки "Подать заявку"
coursesList.addEventListener('click', async (e) => {
    if(e.target.tagName === 'BUTTON' && e.target.dataset.courseId) {
        const courseId = e.target.dataset.courseId;

        const orderData = {
            courseId: courseId,
            userName: prompt("Введите ваше имя"),
            userEmail: prompt("Введите email")
        };

        const newOrder = await createOrder(orderData);
        if (newOrder) alert('Заявка успешно создана');
    }
});