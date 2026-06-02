const products = [

{
id:"rtx5070",
name:"RTX 5070",
price:"20.000.000 VNĐ",
image:"../assets/images/gpu.jpg"
},

{
id:"ryzen9800x3d",
name:"Ryzen 7 9800X3D",
price:"12.000.000 VNĐ",
image:"../assets/images/cpu.jpg"
},

{
id:"ddr5",
name:"DDR5 32GB",
price:"2.800.000 VNĐ",
image:"../assets/images/ram.jpg"
}

];

function renderProducts(data){

const grid =
document.getElementById("productGrid");

grid.innerHTML="";

data.forEach(product=>{

grid.innerHTML += `

<div class="product">

<img src="${product.image}">

<h3>${product.name}</h3>

<p>${product.price}</p>

<a href="product-detail.html?id=${product.id}">
<button>Xem chi tiết</button>
</a>

</div>

`;

});

}

renderProducts(products);

document
.getElementById("searchInput")
.addEventListener("keyup",e=>{

const keyword =
e.target.value.toLowerCase();

const filtered =
products.filter(product=>
product.name
.toLowerCase()
.includes(keyword)
);

renderProducts(filtered);

});