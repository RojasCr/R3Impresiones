document.addEventListener("click", (e) => {
    const currentCart = document.getElementsByClassName("anchor-cart")[0].id;
    const currentProduct = e.target

    
    const url = `/api/carts/${currentCart}/product/${currentProduct.id}`


    if(currentProduct.value === "AddToCart"){

        const method = "POST";
        const headers = {
            "Content-Type": "application/json"
        }
        
        
        fetch(url, {
            method,
            headers
        })
        .then(response => {
            if(response.ok){
                
                return response.json()
            }
        })    
        .then(data => {
            const quantity = document.getElementById("productQuantity")
    
            //if(data.payload.products.length !== 0){
                const totalProducts = data.payload.products.reduce( (acc, curr) => acc + curr.quantity, 0)
                quantity.innerHTML = totalProducts
                    
                
            //}
            
            
            console.log(data)})
        .catch(err => console.error(err))
    }
    //console.log(url)
})