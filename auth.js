// =========================================================================
// 1. CHỨC NĂNG ĐĂNG KÝ (Lưu thông tin vào Admin)
// =========================================================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value; // Giữ nguyên
        const phone = document.getElementById('phone').value; // Giữ nguyên
        const email = document.getElementById('email').value; // Giữ nguyên
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password.length < 6) {
            alert("Mật khẩu phải tối thiểu 6 ký tự!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu nhập lại không khớp!");
            return;
        }

        // --- CHÈN THÊM: KIỂM TRẢ TRÙNG MK VỚI TK ---
        if (password === phone || password === email) {
            alert("Mật khẩu không được trùng với Số điện thoại hoặc Email!");
            return;
        }

        const newUser = {
            fullName: fullName,
            dob: document.getElementById('dob').value,
            phone: phone,
            email: email,
            password: password,
            method: 'Manual' // Đánh dấu đây là đăng ký thủ công
        };

        let accounts = JSON.parse(localStorage.getItem('userAccounts')) || [];

        // --- CHÈN THÊM: KIỂM TRA TRÙNG TÊN ---
        const isNameExisted = accounts.some(u => u.fullName === newUser.fullName);
        if (isNameExisted) {
            alert("Tên người dùng này đã tồn tại!");
            return;
        }

        // Kiểm tra trùng lặp SĐT hoặc Email trong Admin (Logic cũ của bạn)
        const isExisted = accounts.some(u => u.phone === newUser.phone || (newUser.email && u.email === newUser.email));
        
        if (isExisted) {
            alert("Số điện thoại hoặc Email này đã được sử dụng!");
        } else {
            // LƯU VÀO DANH SÁCH TỔNG (ADMIN)
            accounts.push(newUser);
            localStorage.setItem('userAccounts', JSON.stringify(accounts));
            
            alert("Đăng ký thành công! Bạn có thể dùng thông tin này để đăng nhập.");
            window.location.href = "login.html";
        }
    });
}

// =========================================================================
// 2. CHỨC NĂNG ĐĂNG NHẬP THỦ CÔNG (Tạo bộ nhớ riêng)
// =========================================================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputUser = document.getElementById('loginUser').value; 
        const inputPass = document.getElementById('loginPass').value;

        const accounts = JSON.parse(localStorage.getItem('userAccounts')) || [];

        // Đối soát tài khoản và mật khẩu từ danh sách Admin
        const matchedUser = accounts.find(user => 
            (user.phone === inputUser || user.email === inputUser) && user.password === inputPass
        );

        if (matchedUser) {
            // Cấp chìa khóa vào trang chủ
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // LƯU THÔNG TIN RIÊNG (CURRENT USER) - Dựa trên dữ liệu Admin đã tìm thấy
            localStorage.setItem('currentUser', JSON.stringify(matchedUser));
            
            alert(`Chào mừng ${matchedUser.fullName} quay trở lại!`);
            window.location.href = "index.html"; 
        } else {
            alert("Tài khoản không tồn tại hoặc sai mật khẩu!");
        }
    });
}

// =========================================================================
// 3. CHỨC NĂNG SOCIAL (Tự động đăng ký vào Admin + Lưu thông tin riêng)
// =========================================================================
function openSocialPopup(provider) {
    const authUrl = provider === 'Google' 
        ? 'https://accounts.google.com/signin' 
        : 'https://www.facebook.com/login';

    const width = 500;
    const height = 650;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    const popup = window.open(authUrl, 'SocialAuthPopup', `width=${width},height=${height},top=${top},left=${left}`);

    const monitorPopup = setInterval(() => {
        if (!popup || popup.closed) {
            clearInterval(monitorPopup);

            // Giả lập dữ liệu cá nhân từ Google/Facebook
            const socialUser = {
                fullName: `Khách hàng ${provider}`,
                phone: `N/A (${provider})`, 
                email: `${provider.toLowerCase()}_user@gmail.com`,
                dob: "N/A",
                password: `Logged_via_${provider}`,
                method: provider
            };

            // 1. TỰ ĐỘNG ĐĂNG KÝ VÀO ADMIN NẾU CHƯA CÓ
            let accounts = JSON.parse(localStorage.getItem('userAccounts')) || [];
            
            // THÊM: Kiểm tra xem tài khoản MXH này đã có trong Admin chưa
            const existingUser = accounts.find(user => user.email === socialUser.email);
            
            if (!existingUser) {
                // Nếu chưa có thì thêm mới vào Admin
                accounts.push(socialUser);
                localStorage.setItem('userAccounts', JSON.stringify(accounts));
                // Cấp thông tin bản mới cho Profile
                localStorage.setItem('currentUser', JSON.stringify(socialUser));
            } else {
                // Nếu ĐÃ CÓ rồi, thì "CẤP" đúng dữ liệu đã lưu trong Admin cho Profile
                localStorage.setItem('currentUser', JSON.stringify(existingUser));
            }

            // 2. LƯU THÔNG TIN RIÊNG (Dùng để hiển thị trang Profile)
            sessionStorage.setItem('isLoggedIn', 'true');

            alert(`Đăng nhập qua ${provider} thành công! Thông tin đã được cập nhật từ Admin.`);
            window.location.href = "index.html";
        }
    }, 1000);
}

function loginWithGoogle() { openSocialPopup('Google'); }
function loginWithFacebook() { openSocialPopup('Facebook'); }