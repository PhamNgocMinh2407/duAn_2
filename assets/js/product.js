const api = "http://localhost:3000/products";

async function getProducts() {
    const response = await fetch(api);
    const data = await response.json();
    let html = "";
    data.forEach((product) => {
        html += `
            <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>
            <button onClick = "editProduct('${product.id}')">Edit</button>
            <button onClick = "deleteProduct('${product.id}')">Delete</button>
            </td>
            </tr>
        `;
    });
    document.getElementById("product-list").innerHTML = html;
}

async function addProduct() {
    const product = {
        name: document.getElementById("name").value,
          image: document.getElementById("image").value,
        price: document.getElementById("price").value
    };
    await fetch( api, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(product)
});
alert("Thêm sản phẩm thành công");

    getProducts();
}

async function deleteProduct(id) {
    await fetch(`${api}/${id}`, {
        method: "DELETE",
    });
    alert("Xóa sản phẩm thành công");
    getProducts();
}

function editProduct(id){

    window.location.href =
    `edit-product.html?id=${id}`;
}

getProducts();
