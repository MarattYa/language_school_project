import { apiGet } from './api.js';

const coursesList = document.getElementById('courses-list');
const paginationContainer = document.getElementById('courses-pagination');

let coursesData = [];
let filteredCourses = [];
let currentPage = 1;
const itemsPerPage = 6;

// Создание карточки курса
export function createCourseCard(course) {
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="course-card h-100 d-flex flex-column justify-content-between">
                <div>
                    <h5 class="fw-bold mb-2">${course.name}</h5>
                    <p class="text-muted mb-2">Уровень: ${course.level}</p>
                    <p class="text-muted mb-2">Количество часов в неделю: ${course.week_length} ч. </p>
                    <p class="text-muted">Длительность: ${course.total_length} недель</p>
                </div>
                <a href="course.html?id=${course.id}" class="btn btn-primary mt-3">
                    Подробнее
                </a>
            </div>
        </div>
    `;
}

// Рендер текущей страницы + пагинация
function renderCurrentPage() {
    coursesList.innerHTML = '';
    const start = (currentPage-1) * itemsPerPage;
    const pageItems = filteredCourses.slice(start, start + itemsPerPage);

    pageItems.forEach(course => {
        coursesList.insertAdjacentHTML('beforeend', createCourseCard(course));
    });

    renderPagination();
}

function renderPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

    for(let i=1;i<=totalPages;i++){
        const active = i===currentPage ? 'active' : '';
        paginationContainer.insertAdjacentHTML('beforeend', `
            <li class="page-item ${active}">
                <a class="page-link" href="#">${i}</a>
            </li>
        `);
    }

    paginationContainer.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            currentPage = parseInt(e.target.textContent);
            renderCurrentPage();
        });
    });
}

// Фильтрация курсов
function applyFilters(name='',level='') {
    filteredCourses = coursesData.filter(course => {
        const matchesName = course.name.toLowerCase().includes(name.toLowerCase());
        const matchesLevel = level ? course.level === level:true;
        return matchesName && matchesLevel;
    });
    currentPage = 1
    renderCurrentPage();
}

// Загрузка курсов
export async function loadCourses() {
    try {
        coursesData = await apiGet('/courses');
        filteredCourses = [...coursesData];
        renderCurrentPage();

        // Подключением фильтры формы
        const searchInput = document.querySelector('#courses input[type="text"]');
        const levelSelect = document.querySelector('#courses select');

        const form = searchInput.closest('form');
        form.addEventListener('submit', e => {
            e.preventDefault();
            applyFilters(searchInput.value, levelSelect.value);
        });

        // Фильтр в реальном времени при вводе текста
        searchInput.addEventListener('input', () => applyFilters(searchInput.value, levelSelect.value));
        levelSelect.addEventListener('change', () => applyFilters(searchInput.value, levelSelect.value));
        
    } catch(error) {
        console.error(error);
    }
}
