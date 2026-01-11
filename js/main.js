import { loadCourses } from './courses.js';
import { loadTutors } from './tutors.js';

document.addEventListener('DOMContentLoaded', () => {
  
  // загрузка курсов
  loadCourses();

  // Фильтры репетиторов
  const languageFilter = document.getElementById('filter-language');
  const levelFilter = document.getElementById('filter-level');
  const experienceFilter = document.getElementById('filter-experience');
  const tutorFiltersForm = document.getElementById('tutor-filters');

  function applyFilters() {
    const filters = {
      language: languageFilter.value,
      level: levelFilter.value,
      experience: experienceFilter.value ? parseInt(experienceFilter.value): null
    };
    loadTutors(filters);
  }

  // Обработчик изменения фильтров
  tutorFiltersForm.addEventListener('input',applyFilters);

  applyFilters();
});