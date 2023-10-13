const form = document.getElementById("loginForm");
const productsLink = document.getElementById("productsLink")

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    const url = "/auth";
    const headers = {
        "Content-Type": "application/json"
    }
    const method = "POST";
    const body = JSON.stringify(obj);

    fetch(url, {
        headers,
        method,
        body
    })
    .then(response => {
        if(response.redirected){
           window.location.href = response.url
           return;
        }
        return response.json()
    })
    .then(data => {
        console.log(data)
        Swal.fire(
            "¡Oops!",
            data.payload
        )
    })
    .catch(error => console.log(error))
    
})