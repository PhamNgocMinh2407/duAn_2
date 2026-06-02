const api = "http://localhost:3000/orders";

async function getOrders() {
    const response = await fetch(api);
    const data = await response.json();
    let html = "";
    data.forEach(order => {
        html += `
            <tr>
                <td>${order.id}</td>
                <td>${order.userId}</td>
                <td>${order.productIds.join(", ")}</td>
                <td>${order.totalPrice}</td>
                <td>${order.status}</td>
                <td>
                    <button onClick="completeOrder('${order.id}')">Complete</button>
                    <button onClick="cancelOrder('${order.id}')">Cancel</button>
                </td>
            </tr>
        `;
    });
    document.getElementById("Order-list").innerHTML = html;
}


async function completeOrder(Id) {

    await fetch(`${api}/${Id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "Completed" })
    });
    alert("đã xác nhận đơn hàng ");
    getOrders();    
}

async function cancelOrder(Id) {
    await fetch(`${api}/${Id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "Cancelled" })
    });
    alert("đã hủy đơn hàng ");
    getOrders(); 
}

getOrders();