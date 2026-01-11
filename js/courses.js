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

// Рендер 
function renderCourses(options = {}) {
    const {
        containerId = 'courses-list',
        usePagination = true,
        courses = filteredCourses
    } = options;

    const container = document.getElementById(containerId);
    if(!container) return;
    
    if(!usePagination) {
        container.innerHTML = '';
        courses.forEach(course => {
            container.insertAdjacentHTML('beforeend',createCourseCard(course));
        });
        if (paginationContainer) paginationContainer.style.display = 'none';
        return;
    }

    // с пагинацией
    container.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = courses.slice(start, start+itemsPerPage);
    pageItems.forEach(course => {
        container.insertAdjacentHTML('beforeend', createCourseCard(course));
    });
    renderPagination(courses);
}

function renderPagination(courses = filteredCourses) {
    if(!paginationContainer) return;
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(courses.length / itemsPerPage);

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
            renderCurrentPage({courses});
        });
    });
}

// Фильтрация курсов
function applyFilters(name='',level='', courses = coursesData) {
    filteredCourses = courses.filter(course => {
        const matchesName = course.name.toLowerCase().includes(name.toLowerCase());
        const matchesLevel = level ? course.level === level:true;
        return matchesName && matchesLevel;
    });
    currentPage = 1
    renderCurrentPage({courses: filteredCourses, usePagination: true});
}

// Загрузка курсов
export async function loadCourses() {
    try {
        coursesData = await apiGet('/courses');
        filteredCourses = [...coursesData];

        renderCourses({containerId: 'courses-list', usePagination: true});

        const searchInput = document.querySelector('#courses input[type="text"]');
        const levelSelect = document.querySelector('#courses select');

        if(searchInput && levelSelect) {
            const form = searchInput.closest('form');

            form.addEventListener('submit', e => {
                e.preventDefault();
                applyFilters(searchInput.value, levelSelect.value );
            });

            searchInput.addEventListener('input', () => applyFilters(searchInput.value, levelSelect.value));
            levelSelect.addEventListener('change', () => applyFilters(searchInput.value, levelSelect.value));
        }        
    } catch(error) {
        console.error(error);
    }
}

// ренден для старницы препода
export function renderCoursesSimple(containerId, courses) {
    renderCourses({ containerId, usePagination: false, courses});
}

// Получение всех курсов
export async function getCoursesData() {
    if(!coursesData.length) {
        coursesData = await apiGet('/courses');
    }
    return coursesData;
}