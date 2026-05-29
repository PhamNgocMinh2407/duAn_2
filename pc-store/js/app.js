const search = document.getElementById("search");

if(search){

    search.addEventListener("keyup", () => {

        const keyword = search.value.toLowerCase();

        const products =
        document.querySelectorAll(".product");

        products.forEach(product => {

            const text =
            product.innerText.toLowerCase();

            if(text.includes(keyword)){
                product.style.display = "block";
            }else{
                product.style.display = "none";
            }

        });

    });

}