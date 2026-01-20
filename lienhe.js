
// Thay thế script modal bằng code này
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('contactModal');
    const contactBtn = document.querySelector('.vd-prestige-btn');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const closeBtn = document.querySelector('.vd-modal-close');
    const overlay = document.querySelector('.vd-modal-overlay');

    // Mở modal
    if (contactBtn) {
        contactBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Copy Email functionality
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', function () {
            const email = 'anlamdalat@gmail.com';

            // Sử dụng Clipboard API
            navigator.clipboard.writeText(email)
                .then(() => {
                    // Hiệu ứng feedback
                    showCopyFeedback();

                    // Thay đổi trạng thái nút
                    this.classList.add('copied');
                    const icon = this.querySelector('.fa-copy');
                    if (icon) {
                        icon.className = 'fa-solid fa-check';
                    }

                    // Reset sau 2 giây
                    setTimeout(() => {
                        this.classList.remove('copied');
                        if (icon) {
                            icon.className = 'fa-solid fa-copy';
                        }
                    }, 2000);

                    console.log('Email copied:', email);
                })
                .catch(err => {
                    console.error('Copy failed:', err);
                    // Fallback cho trình duyệt cũ
                    fallbackCopyEmail(email);
                });
        });
    }

    // Hàm hiển thị feedback
    function showCopyFeedback() {
        // Xóa feedback cũ nếu có
        const oldFeedback = document.querySelector('.vd-copy-feedback');
        if (oldFeedback) oldFeedback.remove();

        // Tạo feedback mới
        const feedback = document.createElement('div');
        feedback.className = 'vd-copy-feedback';
        feedback.innerHTML = `
            <i class="fa-solid fa-check-circle"></i>
            <span>Đã sao chép email: anlamdalat@gmail.com</span>
        `;

        document.body.appendChild(feedback);

        // Tự động xóa sau 2.5 giây
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2500);
    }

    // Fallback copy cho trình duyệt cũ
    function fallbackCopyEmail(email) {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopyFeedback();
            } else {
                alert('Không thể sao chép. Vui lòng sao chép thủ công: ' + email);
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            alert('Vui lòng sao chép thủ công: ' + email);
        }

        document.body.removeChild(textArea);
    }

    // Đóng modal
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Gán sự kiện đóng modal
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Đóng bằng ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Ngăn đóng khi click trong modal content
    const modalContent = document.querySelector('.vd-modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }
});

// Hàm closeModal cho Zalo link
function closeModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}