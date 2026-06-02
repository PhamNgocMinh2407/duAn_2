const products = {

rtx5070:{
name:"RTX 5070",
price:"20.000.000 VNĐ",
image:"../assets/images/gpu.jpg",
description:"Card đồ họa NVIDIA RTX 5070 hiệu năng cao dành cho game thủ và thiết kế đồ họa."
},

ryzen9800x3d:{
name:"Ryzen 7 9800X3D",
price:"12.000.000 VNĐ",
image:"../assets/images/cpu.jpg",
description:"CPU AMD Ryzen 7 9800X3D với hiệu năng gaming cực mạnh."
},

ddr5:{
name:"DDR5 32GB",
price:"2.800.000 VNĐ",
image:"../assets/images/ram.jpg",
description:"RAM DDR5 32GB tốc độ cao, phù hợp cho gaming và làm việc."
}

};

const params =
new URLSearchParams(window.location.search);

const id =
params.get("id");

const product =
products[id];

if(product){

document.getElementById("productName")
.textContent = product.name;

document.getElementById("productPrice")
.textContent = product.price;

document.getElementById("productDescription")
.textContent = product.description;

document.getElementById("productImage")
.src = product.image;

}