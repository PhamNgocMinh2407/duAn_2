document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const currentUserData = localStorage.getItem('currentUser');
    const authStatusLi = document.getElementById('auth-status');

    if (isLoggedIn === 'true' && currentUserData && authStatusLi) {
        const user = JSON.parse(currentUserData);
        
        authStatusLi.innerHTML = `
            <div class="user-menu-container" style="display: inline-block; position: relative;">
                <a href="profile.html" class="user-name-link" style="color: #ff4d4d; font-weight: bold; text-decoration: none;">
                    👤 ${user.fullName}
                </a>
                <button id="logoutBtn" style="background: none; border: none; color: #999; margin-left: 10px; cursor: pointer; font-size: 13px;">
                    (Đăng xuất)
                </button>
            </div>
        `;

        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            alert('Bạn đã đăng xuất tài khoản!');
            window.location.reload();
        });
    }
});