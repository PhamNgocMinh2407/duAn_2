// Khởi tạo danh sách tài khoản nếu trình duyệt chưa có dữ liệu 'userAccounts'
if (!localStorage.getItem('userAccounts')) {
    localStorage.setItem('userAccounts', JSON.stringify([]));
}

const DB = {
    // 1. Lấy toàn bộ danh sách khách hàng đã đăng ký từ bộ nhớ
    getAllUsers: () => {
        const data = localStorage.getItem('userAccounts');
        return data ? JSON.parse(data) : [];
    },

    // 2. Lưu một khách hàng mới vào "Trang riêng" (Dùng cho trang Register)
    saveUser: (newUser) => {
        const users = DB.getAllUsers();
        
        // Kiểm tra xem số điện thoại hoặc email đã tồn tại chưa để tránh trùng lặp
        const isExisted = users.some(u => u.phone === newUser.phone || u.email === newUser.email);
        
        if (isExisted) {
            return { success: false, message: "Số điện thoại hoặc Email đã tồn tại!" };
        }

        users.push(newUser);
        localStorage.setItem('userAccounts', JSON.stringify(users));
        return { success: true, message: "Lưu dữ liệu thành công!" };
    },

    // 3. Đối soát tài khoản khi đăng nhập (Dùng cho trang Login)
    authenticate: (account, password) => {
        const users = DB.getAllUsers();
        
        // Tìm người dùng khớp Số điện thoại/Email VÀ đúng mật khẩu
        // Phải khớp cả hai thì hàm find mới trả về dữ liệu người dùng
        return users.find(u => 
            (u.phone === account || u.email === account) && u.password === password
        );
    }
};