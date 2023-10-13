const form = document.getElementById("restoreForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);

    const url = "/auth/restore";

    const headers = {
        "Content-Type": "application/json"
    };
    const method = "PATCH";
    const body = JSON.stringify(obj);

    fetch(url, {
        headers,
        method,
        body
    })
    .then(response => response.json())
    .then(data => {

        /*if(data.status === "error"){
            return Swal.fire(
                    '',
                    data.message,
                    'error'
            )
        }*/
        Swal.fire({
            icon: "success",
            text: data.payload
        })
            
        console.log(data)
    })
    .catch(error => console.log(error))
})