
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

  
    authenticate: (account, password) => {
        const users = DB.getAllUsers();
        return users.find(u => 
            (u.phone === account || u.email === account) && u.password === password
        );
    },

    
    setCurrentUser: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

   
    clearSession: () => {
        sessionStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
    }
};
