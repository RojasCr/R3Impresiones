
const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form)
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    //console.log(obj)
    
    const url = "/api/users";
    const headers = {
        "Content-Type": "application/json"
    };
    const method = "POST";
    const body = JSON.stringify(obj);

    fetch(url, {
        headers,
        method,
        body
    })
    .then(response => {
        if(response.redirected){

            return Swal.fire({
                title: "Registrado con éxito",
                icon: "success"

            }
            ).then(res => window.location.href = response.url)
                
           
        }

        return response.json();
    })    
    .then(data => console.log(data.payload))
    .catch(error => console.log(error));
})