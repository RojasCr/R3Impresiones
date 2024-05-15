//const purchaseBtn = document.getElementById("purchaseBtn");
//const deleteBtn = document.getElementById("deleteBtn");


const mp = new MercadoPago("TEST-b44c2836-db5d-499f-8afe-f1f3ec5e15c9", {
    locale: "es-AR"
});

const cartId = document.getElementsByClassName("container")[0].id;

const purchaseInfo = document.getElementById("purchaseInfo");
const purchaseDate = document.getElementById("purchaseDate");
const purchaseCode = document.getElementById("purchaseCode");
const purchaseAmount = document.getElementById("purchaseAmount");
const purchaser = document.getElementById("purchaser");

const totalAmount = document.getElementById("totalAmount");
/*purchaseBtn.addEventListener("click", () => {

})*/

document.addEventListener("click", async(e) => {
    
    const currentBtn = e.target
    console.log(currentBtn.value)
    
    if(currentBtn.id === "purchaseBtn"){
        const urlPay = `http://localhost:8080/api/carts/${currentBtn.value}/purchase`
        //const urlInfo = `http://localhost:8080/api/carts/${currentBtn.value}/purchase`
        
        
        /*fetch(url)
        .then(response => response.json())
        .then(data => {
            purchaseInfo.style.visibility = "visible";
            purchaseCode.innerHTML += data.payload.code
            purchaseDate.innerHTML += data.payload.purchase_datatime
            purchaseAmount.innerHTML += data.payload.amount
            purchaser.innerHTML += data.payload.purchaser
        })
        .catch(error => console.log(error))
        */

        const orderData = {
            title: "Total",
            quantity: 1,
            price: Number(totalAmount.innerHTML)
        }
    
        const response = await fetch(urlPay, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(orderData)
        })
    
        const preference = await response.json();
    
        createCheckoutBtn(preference.payload.id);
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

const createCheckoutBtn = async(preferenceId) => {
    const bricksBuilder = mp.bricks();

    const renderComponent = async () => {

        if(window.checkoutButton) window.checkoutButton.unmount();

        await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId
            }
        });
    };

    renderComponent();
};