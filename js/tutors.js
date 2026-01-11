import { apiGet } from './api.js';

const tutorsList = document.getElementById('tutors-list');

export async function loadTutors(filters={}) {
    try {
        let tutors = await apiGet('/tutors');

        if(filters.language) tutors = tutors.filter(t => t.languages_offered.includes(filters.language));
        if(filters.level) tutors = tutors.filter(t => t.language_level === filters.level);
        if(filters.experience) tutors = tutors.filter(t => t.work_experience >= filters.experience);

        renderTutors(tutors);
    } catch(error) {
        console.error(error);
    }
}

function renderTutors(tutors) {
    tutorsList.innerHTML = '';
    tutors.forEach(t => {
        tutorsList.insertAdjacentHTML('beforeend', `
            <tr>
                <td>${t.name}</td>
                <td>${t.language_level}</td>
                <td>${t.languages_offered.join(', ')}</td>
                <td>${t.work_experience} лет</td>
                <td>${t.price_per_hour} ₽</td>
                <td>
                    <a href="tutor.html?id=${t.id}" class="btn btn-sm btn-primary">
                        Подробнее
                    </a>
                </td>
            </tr>
        `);
    });
}
