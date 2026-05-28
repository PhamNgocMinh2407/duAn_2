// =========================================================================
// 1. XỬ LÝ ĐĂNG KÝ (Chạy khi ở trang register.html)
// =========================================================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Ngăn trang bị tải lại

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation: Kiểm tra độ dài mật khẩu
        if (password.length < 6) {
            alert("Mật khẩu phải tối thiểu 6 ký tự!");
            return;
        }

        // Validation: Kiểm tra mật khẩu nhập lại
        if (password !== confirmPassword) {
            alert("Mật khẩu nhập lại không khớp! Vui lòng kiểm tra lại.");
            return;
        }

        // Thu thập thông tin từ form đăng ký
        const newUser = {
            fullName: document.getElementById('fullName').value,
            dob: document.getElementById('dob').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            password: password // Lưu mật khẩu để trang login đối soát
        };

        // Lấy danh sách tài khoản hiện tại từ database.js (LocalStorage)
        let accounts = JSON.parse(localStorage.getItem('userAccounts')) || [];

        // Kiểm tra xem Số điện thoại này đã có ai đăng ký chưa
        const isPhoneExisted = accounts.some(user => user.phone === newUser.phone);
        if (isPhoneExisted) {
            alert("Số điện thoại này đã được sử dụng để đăng ký tài khoản!");
            return;
        }

        // Nếu hợp lệ, đẩy vào "mảng dữ liệu riêng"
        accounts.push(newUser);
        localStorage.setItem('userAccounts', JSON.stringify(accounts));

        alert("Đăng ký thành viên thành công! Hệ thống sẽ chuyển bạn sang trang đăng nhập.");
        window.location.href = "login.html"; // Chuyển hướng
    });
}

// =========================================================================
// 2. XỬ LÝ ĐĂNG NHẬP THỦ CÔNG (Chạy khi ở trang login.html)
// =========================================================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputUser = document.getElementById('loginUser').value; // Nhận cả SĐT hoặc Email
        const inputPass = document.getElementById('loginPass').value;

        // Lấy dữ liệu từ "trang riêng" (LocalStorage) về để đối soát
        const accounts = JSON.parse(localStorage.getItem('userAccounts')) || [];

        // Tiến hành đối soát: Tìm tài khoản trùng khớp SĐT/Email VÀ đúng mật khẩu
        const matchedUser = accounts.find(user => 
            (user.phone === inputUser || user.email === inputUser) && user.password === inputPass
        );

        if (matchedUser) {
            // ĐÚNG: Cấp "chìa khóa" vào cổng (Session) và lưu thông tin người dùng đang đăng nhập
            sessionStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(matchedUser));

            alert(`Đăng nhập thành công! Chào mừng ${matchedUser.fullName} quay trở lại.`);
            window.location.href = "index.html"; // Chuyển thẳng về trang chủ giao diện
        } else {
            // SAI: Không có trong dữ liệu hoặc sai mật khẩu -> Báo lỗi chặn lại
            alert("Tài khoản không tồn tại trên hệ thống hoặc sai mật khẩu!");
        }
    });
}

// =========================================================================
// 3. XỬ LÝ ĐĂNG NHẬP GOOGLE / FACEBOOK POPUP (Dùng chung cho cả 2 nút bấm)
// =========================================================================
function openSocialPopup(provider) {
    // Cấu hình link trang đăng nhập chính chủ
    const authUrl = provider === 'Google' 
        ? 'https://accounts.google.com/signin' 
        : 'https://www.facebook.com/login';

    // Cấu hình kích thước cửa sổ hiển thị ở giữa màn hình
    const width = 500;
    const height = 650;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    // Mở cửa sổ popup thật
    const popup = window.open(authUrl, 'SocialAuthPopup', `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`);

    // Lắng nghe trạng thái: Khi người dùng tương tác xong và tắt cửa sổ popup
    const monitorPopup = setInterval(() => {
        if (!popup || popup.closed) {
            clearInterval(monitorPopup);

            // Giả lập lưu phiên và tạo thông tin người dùng Social
            const socialUser = {
                fullName: `Khách hàng ${provider}`,
                phone: "Đăng nhập qua MXH",
                email: `${provider.toLowerCase()}user@gmail.com`,
                dob: "N/A"
            };

            sessionStorage.setItem('isLoggedIn', 'true'); // Cấp chìa khóa vào index.html
            localStorage.setItem('currentUser', JSON.stringify(socialUser));

            alert(`Đăng nhập bằng tài khoản ${provider} hoàn tất!`);
            window.location.href = "index.html"; // Bay thẳng về trang giao diện chính
        }
    }, 1000);
}

// Khai báo 2 hàm được gọi trực tiếp từ thuộc tính onclick trên HTML của bạn
function loginWithGoogle() { openSocialPopup('Google'); }
function loginWithFacebook() { openSocialPopup('Facebook'); }