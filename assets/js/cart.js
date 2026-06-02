let cart = JSON.parse(localStorage.getItem('cart')) || [];
let discount = 0; 

const cartTableBody = document.getElementById('cart-table-body');
const subTotalEl = document.getElementById('sub-total');
const discountEl = document.getElementById('discount-amount');
const finalTotalEl = document.getElementById('final-total');
const voucherInput = document.getElementById('voucher-input');
const btnApplyVoucher = document.getElementById('btn-apply-voucher');
const checkoutForm = document.getElementById('checkout-form');

// Vẽ danh sách sản phẩm ra bảng
function renderCart() {
    cartTableBody.innerHTML = ''; 

    if (cart.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Giỏ hàng trống.</td></tr>';
        updatePriceSummary(0);
        return;
    }

    let subTotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subTotal += itemTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price.toLocaleString()} đ</td>
            <td>
                <button onclick="changeQty(${item.id}, -1)">-</button>
                <span style="margin: 0 10px; font-weight:bold;">${item.quantity}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </td>
            <td>${itemTotal.toLocaleString()} đ</td>
            <td><button onclick="deleteItem(${item.id})" style="color:red;">Xóa</button></td>
        `;
        cartTableBody.appendChild(tr);
    });

    updatePriceSummary(subTotal);
}

// Thay đổi số lượng sản phẩm (+/-)
window.changeQty = function(productId, change) {
    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1;
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
};

// Xóa sản phẩm khỏi giỏ hàng
window.deleteItem = function(productId) {
    cart = cart.filter(p => p.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
};

// Tính toán tiền bạc và kiểm tra Voucher
function updatePriceSummary(subTotal) {
    const code = voucherInput.value.trim();
    
    if (code === 'GIAM20') {
        discount = subTotal * 0.2; 
    } else if (code === '50K') {
        discount = subTotal > 0 ? 50000 : 0; 
    } else {
        discount = 0;
    }

    const finalTotal = subTotal - discount > 0 ? subTotal - discount : 0;

    subTotalEl.innerText = subTotal.toLocaleString();
    discountEl.innerText = discount.toLocaleString();
    finalTotalEl.innerText = finalTotal.toLocaleString();
}

// Bấm nút áp mã
btnApplyVoucher.addEventListener('click', () => {
    renderCart(); 
});

// Gửi đơn hàng lên JSON Server khi bấm xác nhận đặt hàng
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }

    const subTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = subTotal - discount;

    const orderData = {
        customerName: document.getElementById('customer-name').value,
        phone: document.getElementById('customer-phone').value,
        address: document.getElementById('customer-address').value,
        items: cart,
        subTotal: subTotal,
        discount: discount,
        finalTotal: finalTotal,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    try {
        const response = await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            alert('Đặt hàng thành công!');
            cart = [];
            localStorage.removeItem('cart');
            checkoutForm.reset();
            renderCart();
        } else {
            alert('Lỗi dữ liệu phía JSON Server!');
        }
    } catch (err) {
        console.error(err);
        alert('Lỗi kết nối! Bạn cần bật JSON Server cổng 3000 để lưu đơn.');
    }
});

renderCart();