
if (!localStorage.getItem('userAccounts')) {
    localStorage.setItem('userAccounts', JSON.stringify([]));
}

const DB = {
    
    getAllUsers: () => {
        const data = localStorage.getItem('userAccounts');
        return data ? JSON.parse(data) : [];
    },

   
    saveUser: (newUser) => {
        const users = DB.getAllUsers();
        
      
        const isExisted = users.some(u => u.phone === newUser.phone || u.email === newUser.email);
        
        if (isExisted) {
            return { success: false, message: "Số điện thoại hoặc Email đã tồn tại!" };
        }
        users.push(newUser);
        localStorage.setItem('userAccounts', JSON.stringify(users));
        return { success: true, message: "Lưu dữ liệu thành công!" };
    },

    
    authenticate: (account, password) => {
        const users = DB.getAllUsers();
        return users.find(u => 
            (u.phone === account || u.email === account) && u.password === password
        );
    }
};
