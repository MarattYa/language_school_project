const coursesList = document.getElementById('courses-list');


// html карточки
function createCourseCard(course) {
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

// Список курсов

function renderCourse(courses) {
    coursesList.innerHTML = '';

    courses.forEach(course => {
        coursesList.insertAdjacentHTML(
            'beforeend',
            createCourseCard(course)
        );
    });

}

// Загрузка курсов из API

async function loadCourses() {
    try {
        const courses = await apiGet('/courses');
        renderCourse(courses);
    } catch (error) {
        console.error(error);
    }
}