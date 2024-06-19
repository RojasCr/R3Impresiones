const cartId = document.getElementsByClassName("cartInfo")[0].id;

const purchaseInfo = document.getElementById("purchaseInfo");
const purchaseDate = document.getElementById("purchaseDate");
const purchaseCode = document.getElementById("purchaseCode");
const purchaseAmount = document.getElementById("purchaseAmount");
const purchaser = document.getElementById("purchaser");

const totalAmount = document.getElementById("totalAmount");

document.addEventListener("click", async(e) => {
    
    const currentBtn = e.target
    console.log(currentBtn.value)
    
    if(currentBtn.id === "purchaseBtn"){
        const urlPay = `/api/carts/${currentBtn.value}/purchase`

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
    
        createCheckoutBtn(preference.payload.apiKey, preference.payload.id);
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

const createCheckoutBtn = async(apiKey, preferenceId) => {

    const mp = new MercadoPago(apiKey, {
        locale: "es-AR"
    });

    console.log(apiKey);

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