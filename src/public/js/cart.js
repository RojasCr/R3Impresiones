//const purchaseBtn = document.getElementById("purchaseBtn");
//const deleteBtn = document.getElementById("deleteBtn");
const cartId = document.getElementsByClassName("container")[0].id;

const purchaseInfo = document.getElementById("purchaseInfo");
const purchaseDate = document.getElementById("purchaseDate");
const purchaseCode = document.getElementById("purchaseCode");
const purchaseAmount = document.getElementById("purchaseAmount");
const purchaser = document.getElementById("purchaser");

/*purchaseBtn.addEventListener("click", () => {

})*/

document.addEventListener("click", (e) => {
    
    const currentBtn = e.target
    console.log(currentBtn.value)
    if(currentBtn.id === "purchaseBtn"){
        const url = `/api/carts/${currentBtn.value}/purchase`
        
        fetch(url)
        .then(response => response.json())
        .then(data => {
            purchaseInfo.style.visibility = "visible";
            purchaseCode.innerHTML += data.payload.code
            purchaseDate.innerHTML += data.payload.purchase_datatime
            purchaseAmount.innerHTML += data.payload.amount
            purchaser.innerHTML += data.payload.purchaser
        })
        .catch(error => console.log(error))

    }
    
    
    if(currentBtn.id === "deleteBtn"){

        const url = `api/carts/${cartId}/products/${currentBtn.value}`
    
        const headers = {
            "Content-Type": "application/json"
        }
    
        const method = "DELETE"
    
        fetch(url, {
            headers,
            method
        })
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                icon: "success",
                text: data.payload
            })
            .then(() => window.location.reload())
            
        })
        .catch(err => console.log(err))
    }

})