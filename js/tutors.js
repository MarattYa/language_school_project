import { apiGet } from './api.js';

const tutorsList = document.getElementById('tutors-list');

const languageSelect = document.getElementById('filter-language');
const levelSelect = document.getElementById('filter-level');

[languageSelect, levelSelect].forEach(select => {
  select.addEventListener('change', () => {
    loadTutors({
      language: languageSelect.value,
      level: levelSelect.value
    });
  });
});

export async function loadTutors(filters = {}) {
    try {
        let tutors = await apiGet('/tutors');

        if(filters.language) {
            tutors = tutors.filter(t => t.language === filters.language);
        }
        if(filters.level) {
            tutors = tutors.filter(t => t.level === filters.level);
        }
        if(filters.experience) {
            tutors = tutors.filter(t => t.experience >= filters.experience);
        }

        renderTutors(tutors);
    } catch (error) {
        console.log(error);
    }
}

function renderTutors(tutors) {
    tutorsList.innerHTML = '';
    tutors.forEach(t => {
        tutorsList.insertAdjacentHTML('beforeend', `
            <tr title="${t.description || ''}">
                <td><img src="${t.photo || 'assets/img/tutor-placeholder.png'}" width="50"></td>
                <td>${t.name}</td>
                <td>${t.level}</td>
                <td>${t.language}</td>
                <td>${t.experience} лет</td>
                <td>${t.price} ₽</td>
                <td><button class="btn btn-sm btn-primary">Записаться</button></td>
            </tr>
        `);
    });
}