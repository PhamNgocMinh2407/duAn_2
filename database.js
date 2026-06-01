// Khởi tạo bộ nhớ tổng nếu chưa có
if (!localStorage.getItem('userAccounts')) {
    localStorage.setItem('userAccounts', JSON.stringify([]));
}

const DB = {
    // 1. LẤY TẤT CẢ TÀI KHOẢN (Dùng cho trang Admin)
    getAllUsers: () => {
        const data = localStorage.getItem('userAccounts');
        return data ? JSON.parse(data) : [];
    },

    // 2. LƯU TÀI KHOẢN MỚI (Dùng cho Đăng ký & Social Login tự động)
    saveUser: (newUser) => {
        const users = DB.getAllUsers();
        
        // Kiểm tra trùng lặp (nếu đã có email hoặc sđt thì không lưu chồng lên)
        const isExisted = users.some(u => 
            (newUser.phone && u.phone === newUser.phone && u.phone !== "N/A") || 
            (newUser.email && u.email === newUser.email)
        );
        
        if (isExisted) {
            return { success: false, message: "Tài khoản đã tồn tại trong hệ thống!" };
        }

        users.push(newUser);
        localStorage.setItem('userAccounts', JSON.stringify(users));
        return { success: true, message: "Lưu dữ liệu thành công!" };
    },

    // 3. ĐỐI SOÁT ĐĂNG NHẬP
    authenticate: (account, password) => {
        const users = DB.getAllUsers();
        return users.find(u => 
            (u.phone === account || u.email === account) && u.password === password
        );
    },

    // 4. QUẢN LÝ NGƯỜI DÙNG HIỆN TẠI (Thông tin riêng sau khi đăng nhập)
    setCurrentUser: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    // 5. ĐĂNG XUẤT (Xóa thông tin riêng nhưng giữ lại Admin Data)
    clearSession: () => {
        sessionStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
    }
};