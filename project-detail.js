// project-detail.js - Đọc ID từ URL và hiển thị chi tiết dự án

// URL của file JSON
const url = 'https://anlamdalat.vn/uploads/pages/du-an/docs/projects.json';

// Hàm async để load dữ liệu JSON
async function loadProjectFromUrl(url) {
    try {
        // 1. Fetch dữ liệu từ URL
        const response = await fetch(url);

        // Kiểm tra xem request có thành công không (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 2. Phân tích cú pháp JSON
        const data = await response.json();
        console.log('Dữ liệu JSON đã đọc:', data);
        return data; // Trả về đối tượng JSON

    } catch (error) {
        console.error('Lỗi khi đọc file JSON:', error);
        return null;
    }
}

// Hàm lấy tham số ID từ URL
function getProjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    console.log('ID dự án từ URL:', projectId);
    return projectId ? parseInt(projectId) : null;
}

// Hàm tìm dự án theo ID
function findProjectById(projects, id) {
    return projects.find(project => project.id === id);
}

// Hàm cập nhật nội dung HTML với dữ liệu dự án
function updatePageContent(project) {
    if (!project) {
        console.error('Không tìm thấy dự án');
        return;
    }

    // Cập nhật tiêu đề trang
    document.title = `${project.title} - An Lâm Construction`;

    // Cập nhật tiêu đề dự án
    const titleElement = document.querySelector('.vd-project-title-large');
    if (titleElement) {
        titleElement.textContent = project.title;
    }

    // Cập nhật thông tin meta
    const metaValues = document.querySelectorAll('.vd-meta-value');
    if (metaValues.length >= 4) {
        metaValues[0].textContent = project.client || 'N/A';      // Khách hàng
        metaValues[1].textContent = project.producer || 'An Lâm Construction'; // Nhà sản xuất
        metaValues[2].textContent = project.location || 'N/A';    // Vị trí
        metaValues[3].textContent = project.region || 'N/A';      // Vùng
    }

    // Hàm kiểm tra xem URL có phải là video không
    const isVideo = (url) => {
        return url && url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i);
    };

    // Cập nhật hình ảnh chính (hoặc video chính)
    // Cập nhật hình ảnh chính (hoặc video chính)
    const mainWrapper = document.querySelector('.vd-gallery-main');
    if (mainWrapper && project.mainImage) {
        if (isVideo(project.mainImage)) {
            // Xác định mime-type
            let mimeType = 'video/mp4';
            if (project.mainImage.toLowerCase().endsWith('.mov')) mimeType = 'video/quicktime';
            if (project.mainImage.toLowerCase().endsWith('.webm')) mimeType = 'video/webm';

            // Nếu là video
            mainWrapper.innerHTML = `
                <div class="vd-gallery-item">
                    <video class="vd-lightbox-trigger" controls autoplay loop muted playsinline style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
                        <source src="${project.mainImage}" type="${mimeType}">
                        <source src="${project.mainImage}" type="video/mp4"> <!-- Fallback -->
                        Trình duyệt của bạn không hỗ trợ video này.
                    </video>
                </div>
            `;
        } else {
            // Nếu là ảnh
            mainWrapper.innerHTML = `
                <div class="vd-gallery-item">
                    <img src="${project.mainImage}" alt="${project.title}" class="vd-lightbox-trigger" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
                </div>
            `;
        }
    }

    // Cập nhật gallery (hình ảnh/video phụ) - Render động không giới hạn
    const galleryContainer = document.querySelector('.vd-gallery-sub');
    if (galleryContainer && project.gallery && project.gallery.length > 0) {
        const galleryHTML = project.gallery.map((mediaSrc, index) => {
            if (isVideo(mediaSrc)) {
                // Thêm #t=0.1 để gợi ý lấy frame đầu tiên làm thumbnail
                // Dùng preload="none" để không tải gì cả ban đầu
                return `
                <div class="vd-gallery-item">
                     <video data-src="${mediaSrc}" class="vd-lightbox-trigger vd-lazy-video" muted preload="none" style="pointer-events: none;">
                        <source src="${mediaSrc}#t=0.1" type="video/mp4">
                     </video>
                     <div class="vd-play-icon"><i class="fa-solid fa-play"></i></div>
                </div>`;
            } else {
                return `
                <div class="vd-gallery-item">
                    <img src="${mediaSrc}" alt="${project.title} - Ảnh ${index + 1}" class="vd-lightbox-trigger" loading="lazy">
                </div>`;
            }
        }).join('');
        galleryContainer.innerHTML = galleryHTML;

        // Kích hoạt Lazy Loading cho Video
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        // Khi video vào khung hình, đổi preload thành metadata để hiện thumbnail
                        if (video.getAttribute('preload') === 'none') {
                            video.setAttribute('preload', 'metadata');
                            // Một số trình duyệt cần gọi load() để apply thay đổi preload
                            // video.load(); // (Cẩn thận: load() có thể reset flash màn hình đen)
                        }
                        observer.unobserve(video);
                    }
                });
            });

            document.querySelectorAll('video.vd-lazy-video').forEach(video => {
                videoObserver.observe(video);
            });
        }
    } else if (galleryContainer) {
        galleryContainer.innerHTML = '';
    }

    console.log('Đã cập nhật nội dung trang với dự án:', project.title);
}

// Hàm xáo trộn mảng ngẫu nhiên (Fisher-Yates shuffle)
function shuffleArray(array) {
    const shuffled = [...array]; // Tạo bản sao để không thay đổi mảng gốc
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Hàm render "Dự án khác" - hiển thị các dự án khác trừ dự án hiện tại
function renderMoreProjects(projects, currentProjectId) {
    const moreProjectsGrid = document.getElementById('moreProjectsGrid');
    if (!moreProjectsGrid) {
        console.error('Không tìm thấy container #moreProjectsGrid');
        return;
    }

    // Lọc bỏ dự án hiện tại, xáo trộn ngẫu nhiên, và lấy tối đa 4 dự án
    const otherProjects = shuffleArray(
        projects.filter(project => project.id !== currentProjectId)
    ).slice(0, 4);

    if (otherProjects.length === 0) {
        moreProjectsGrid.innerHTML = '<p>Không có dự án khác.</p>';
        return;
    }

    // Tạo HTML cho các card dự án
    const projectCardsHTML = otherProjects.map(project => `
        <a href="https://anlamdalat.vn/page/chi-tiet-du-an?id=${project.id}" class="vd-more-project-card">
            <div class="vd-more-project-img">
                <img src="${project.mainImage}" alt="${project.title}">
            </div>
            <h3 class="vd-more-project-name">${project.title} <i class="fa-solid fa-arrow-right-long"></i></h3>
        </a>
    `).join('');

    moreProjectsGrid.innerHTML = projectCardsHTML;
    console.log(`Đã render ${otherProjects.length} dự án khác`);
}

// Hàm chính - chạy khi trang load xong
async function init() {
    // 1. Lấy ID từ URL
    const projectId = getProjectIdFromUrl();

    if (!projectId) {
        console.error('Không tìm thấy ID dự án trong URL');
        return;
    }

    // 2. Load dữ liệu từ JSON
    const projects = await loadProjectFromUrl(url);

    if (!projects) {
        console.error('Không thể tải dữ liệu dự án');
        return;
    }

    // 3. Tìm dự án theo ID
    const project = findProjectById(projects, projectId);

    if (!project) {
        console.error(`Không tìm thấy dự án với ID: ${projectId}`);
        return;
    }

    // 4. Cập nhật nội dung trang
    updatePageContent(project);

    // 5. Render phần "Dự án khác"
    renderMoreProjects(projects, projectId);
}

// Gọi hàm init khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', init);
