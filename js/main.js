import { loadCourses } from './courses.js';
import { loadTutors } from './tutors.js';

document.addEventListener('DOMContentLoaded', () => {
  loadCourses();
  loadTutors(); 
});