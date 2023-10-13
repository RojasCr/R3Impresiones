const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(contactForm);

    const obj = {}

    data.forEach((value, key) => obj[key] = value);

    const url = "/auth/sendMail";

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
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data.status == "error"){
            return Swal.fire({
                title: '¡Oops!',
                text: data.payload,
                icon: 'question',
                footer: `<a href="/signup">Puedes registrarte</a>`
            })
            

        }
        //alert(data.message)
        Swal.fire(
            '¡Bien!',
            'Te hemos enviado un mail de verificación',
            'success'
        )
    })
})