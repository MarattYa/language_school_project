// courses.js
import { apiGet } from './api.js';
import { showOrderModal } from './modal.js';

let allCourses = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 5; // По требованию задания

export async function loadCourses() {
    try {
        allCourses = await apiGet('/courses');
        renderCourses();
        renderPagination();
    } catch (error) {
        showNotification('Ошибка загрузки курсов', 'danger');
        console.error(error);
    }
}

export function renderCourses() {
    const container = document.getElementById('courses-list');
    if (!container) return;
    
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const coursesToShow = allCourses.slice(start, end);
    
    container.innerHTML = coursesToShow.map(createCourseCard).join('');
    
    // Добавляем обработчики на кнопки
    container.querySelectorAll('.btn-apply').forEach(button => {
        button.addEventListener('click', (e) => {
            const courseId = parseInt(e.target.dataset.courseId);
            const course = allCourses.find(c => c.id === courseId);
            if (course) {
                showOrderModal({ type: 'course', data: course });
            }
        });
    });
}

function createCourseCard(course) {
    return `
    <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${course.name}</h5>
                <p class="card-text text-muted small mb-2">
                    Уровень: <span class="badge bg-info">${course.level}</span>
                </p>
                <p class="card-text">
                    <strong>Преподаватель:</strong> ${course.teacher}
                </p>
                <p class="card-text">
                    <strong>Длительность:</strong> ${course.total_length} недель
                    (${course.week_length} ч/нед)
                </p>
                <p class="card-text">
                    <strong>Стоимость/час:</strong> ${course.course_fee_per_hour} ₽
                </p>
                <div class="mt-auto">
                    <button class="btn btn-primary w-100 btn-apply" 
                            data-course-id="${course.id}">
                        Подать заявку
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

export function renderPagination() {
    const container = document.getElementById('courses-pagination');
    if (!container) return;
    
    const totalPages = Math.ceil(allCourses.length / ITEMS_PER_PAGE);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Назад</a>
        </li>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Вперед</a>
        </li>
    `;
    
    container.innerHTML = html;
    
    // Обработчики пагинации
    container.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(e.target.dataset.page);
            if (page && page >= 1 && page <= totalPages) {
                currentPage = page;
                renderCourses();
                renderPagination();
            }
        });
    });
}

// Фильтрация курсов
export function filterCourses() {
    const searchInput = document.querySelector('#course-search');
    const levelSelect = document.querySelector('#course-level');
    
    if (!searchInput || !levelSelect) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const level = levelSelect.value;
    
    let filtered = allCourses;
    
    if (searchTerm) {
        filtered = filtered.filter(course => 
            course.name.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm)
        );
    }
    
    if (level) {
        filtered = filtered.filter(course => course.level === level);
    }
    
    // Обновляем отображение
    currentPage = 1;
    allCourses = filtered;
    renderCourses();
    renderPagination();
}