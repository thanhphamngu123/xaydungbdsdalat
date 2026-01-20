// projects.js - Đọc JSON và render các dự án ra HTML
document.addEventListener('DOMContentLoaded', function () {
    const projectsGrid = document.getElementById('projects-grid');

    if (!projectsGrid) return;

    // Fetch dữ liệu từ file JSON
    fetch('https://anlamdalat.vn/uploads/pages/du-an/docs/projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu dự án');
            }
            return response.json();
        })
        .then(projects => {
            renderProjects(projects);
        })
        .catch(error => {
            console.error('Lỗi:', error);
            projectsGrid.innerHTML = '<p style="color: red;">Không thể tải danh sách dự án.</p>';
        });

    // Hàm render các dự án
    function renderProjects(projects) {
        projectsGrid.innerHTML = '';

        projects.forEach(project => {
            const projectCard = document.createElement('a');
            // Truyền ID qua URL
            projectCard.href = `https://anlamdalat.vn/page/chi-tiet-du-an?id=${project.id}`;
            projectCard.className = 'vd-project-item-card';
            projectCard.dataset.category = project.category;

            projectCard.innerHTML = `
                <div class="vd-project-img">
                    <img src="${project.mainImage}" alt="${project.title}">
                </div>
                <div class="vd-project-info">
                    <h3>${project.title} <i class="fa-solid fa-arrow-right-long"></i></h3>
                </div>
            `;

            projectsGrid.appendChild(projectCard);
        });
    }
});
