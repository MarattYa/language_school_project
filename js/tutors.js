// tutors.js
import { apiGet } from './api.js';
import { showOrderModal } from './modal.js';

let allTutors = [];
let selectedTutor = null;

export async function loadTutors() {
    try {
        allTutors = await apiGet('/tutors');
        renderTutors();
        setupFilters();
    } catch (error) {
        showNotification('Ошибка загрузки репетиторов', 'danger');
        console.error(error);
    }
}

function renderTutors(tutors = allTutors) {
    const container = document.getElementById('tutors-list');
    if (!container) return;
    
    container.innerHTML = tutors.map(createTutorRow).join('');
    
    // Обработчики выбора репетитора
    container.querySelectorAll('.btn-select-tutor').forEach(button => {
        button.addEventListener('click', (e) => {
            const tutorId = parseInt(e.target.dataset.tutorId);
            const tutor = allTutors.find(t => t.id === tutorId);
            
            // Сбрасываем предыдущее выделение
            container.querySelectorAll('tr').forEach(tr => {
                tr.classList.remove('table-primary');
            });
            
            // Выделяем выбранную строку
            const row = e.target.closest('tr');
            row.classList.add('table-primary');
            
            // Сохраняем выбранного репетитора
            selectedTutor = tutor;
            
            // Кнопка для подачи заявки
            showOrderModal({ type: 'tutor', data: tutor });
        });
    });
}

function createTutorRow(tutor) {
    return `
    <tr>
        <td>
            <div class="d-flex align-items-center">
                <img src="sources/img/tutor-placeholder.png" 
                     class="rounded-circle me-2" 
                     width="40" height="40" 
                     alt="${tutor.name}">
                <span>${tutor.name}</span>
            </div>
        </td>
        <td>
            <span class="badge bg-info">${tutor.language_level}</span>
        </td>
        <td>${tutor.languages_offered.join(', ')}</td>
        <td>${tutor.work_experience} лет</td>
        <td>${tutor.price_per_hour} ₽/час</td>
        <td>
            <button class="btn btn-sm btn-primary btn-select-tutor"
                    data-tutor-id="${tutor.id}">
                Выбрать
            </button>
        </td>
    </tr>`;
}

function setupFilters() {
    const languageSelect = document.getElementById('tutor-language');
    const levelSelect = document.getElementById('tutor-level');
    const experienceInput = document.getElementById('tutor-experience');
    
    if (!languageSelect || !levelSelect || !experienceInput) return;
    
    // Заполняем языки уникальными значениями
    const allLanguages = [...new Set(allTutors.flatMap(t => t.languages_offered))];
    languageSelect.innerHTML = `
        <option value="">Все языки</option>
        ${allLanguages.map(lang => `<option value="${lang}">${lang}</option>`).join('')}
    `;
    
    // Обработчики фильтров
    const filterTutors = () => {
        let filtered = allTutors;
        
        if (languageSelect.value) {
            filtered = filtered.filter(t => 
                t.languages_offered.includes(languageSelect.value)
            );
        }
        
        if (levelSelect.value) {
            filtered = filtered.filter(t => 
                t.language_level === levelSelect.value
            );
        }
        
        if (experienceInput.value) {
            const exp = parseInt(experienceInput.value);
            filtered = filtered.filter(t => t.work_experience >= exp);
        }
        
        renderTutors(filtered);
    };
    
    languageSelect.addEventListener('change', filterTutors);
    levelSelect.addEventListener('change', filterTutors);
    experienceInput.addEventListener('input', filterTutors);
}

export function getSelectedTutor() {
    return selectedTutor;
}