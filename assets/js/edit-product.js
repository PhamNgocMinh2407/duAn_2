const api = "http://localhost:3000/products";
 const params = new URLSearchParams(window.location.search);
 const id = params.get("id");

 async function getProductDetail() {
    const response = await fetch(`${api}/${id}`);
    const product = await response.json();
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
}


async function updateProduct() {
    const updatedProduct = {
        id: id,
        name: document.getElementById("name").value,
        price: document.getElementById("price").value
    };

    await fetch(`${api}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    });
    alert("Cập nhật sản phẩm thành công");
    window.location.href = "add-product.html";
}
getProductDetail();