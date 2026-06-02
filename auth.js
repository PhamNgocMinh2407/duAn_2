
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value; 
        const phone = document.getElementById('phone').value; 
        const email = document.getElementById('email').value; 
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
            method: 'Manual' 
        };

        let accounts = JSON.parse(localStorage.getItem('userAccounts')) || [];

        
        const isNameExisted = accounts.some(u => u.fullName === newUser.fullName);
        if (isNameExisted) {
            alert("Tên người dùng này đã tồn tại!");
            return;
        }

       
        const isExisted = accounts.some(u => u.phone === newUser.phone || (newUser.email && u.email === newUser.email));
        
        if (isExisted) {
            alert("Số điện thoại hoặc Email này đã được sử dụng!");
        } else {
           
            accounts.push(newUser);
            localStorage.setItem('userAccounts', JSON.stringify(accounts));
            
            alert("Đăng ký thành công! Bạn có thể dùng thông tin này để đăng nhập.");
            window.location.href = "login.html";
        }
    });
}


const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputUser = document.getElementById('loginUser').value; 
        const inputPass = document.getElementById('loginPass').value;

        const accounts = JSON.parse(localStorage.getItem('userAccounts')) || [];

       
        const matchedUser = accounts.find(user => 
            (user.phone === inputUser || user.email === inputUser) && user.password === inputPass
        );

        if (matchedUser) {
          
            sessionStorage.setItem('isLoggedIn', 'true');
            
          
            localStorage.setItem('currentUser', JSON.stringify(matchedUser));
            
            alert(`Chào mừng ${matchedUser.fullName} quay trở lại!`);
            window.location.href = "index.html"; 
        } else {
            alert("Tài khoản không tồn tại hoặc sai mật khẩu!");
        }
    });
}


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

           
            let accounts = JSON.parse(localStorage.getItem('userAccounts')) || [];
            
          
            const existingUser = accounts.find(user => user.email === socialUser.email);
            
            if (!existingUser) {
                
                accounts.push(socialUser);
                localStorage.setItem('userAccounts', JSON.stringify(accounts));
               
                localStorage.setItem('currentUser', JSON.stringify(socialUser));
            } else {
                
                localStorage.setItem('currentUser', JSON.stringify(existingUser));
            }

            
            sessionStorage.setItem('isLoggedIn', 'true');

            alert(`Đăng nhập qua ${provider} thành công! Thông tin đã được cập nhật từ Admin.`);
            window.location.href = "index.html";
        }
    }, 1000);
}

function loginWithGoogle() { openSocialPopup('Google'); }
function loginWithFacebook() { openSocialPopup('Facebook'); }
