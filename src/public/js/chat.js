const socket = io();
//socket.emit("message", "¡Hola desde socket");
let user;
/*socket.on("mes", data => {
    console.log(data);
})*/
//console.log("funciona");

Swal.fire({
    title: "Identificate para continuar",
    input: "text",
    inputPlaceholder: "Ingrese nickname",
    inputValidator: (value) => {
        if(!value){
            return `¡Necesitas ingresar un usuario para continuar!`
        }

    },
    imageUrl: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.southpark.us.en:871078f4-35f8-4ffd-9b26-156124e12e7d?quality=0.7&gen=ntrn&legacyStatusCode=true",
    confirmButtonText: "Entrar",
    allowOutsideClick: false
}).then( result => {
    console.log(result.value)
    user = result.value;
}
)

const res = document.getElementById("res");
//const user = document.getElementById("user");
const text = document.getElementById("text");
const enviar = document.getElementById("enviarImg");
const archivo = document.getElementById("archivoBtn");
const file = document.getElementById("file");





document.addEventListener("keydown", (e) => {
    //socket.id = user.value;
    //console.log(e.key);
    
    if(e.key === "Enter"){
        if(text.value){
            socket.emit("message", user, text.value);
            text.value = "";
        }
    }

    if(file.files[0]){

        const reader = new FileReader();
        reader.addEventListener("load", (e) =>{
            socket.emit("enviarArchivo", user, e.target.result);
            /*let image = document.createElement("img");
            res.appendChild(image)
            image.style.width = "10rem";
            image.style.height = "15rem";
            image.src = data;
            console.log(e.target.result)*/
        })
        
        reader.readAsDataURL(file.files[0]);
        
        
    }

});


archivo.addEventListener("click", () =>{
    file.click();
    
})


enviar.addEventListener("click", () => {
    socket.id = user;
    //console.log(e.key);
    
    if(text.value){
        socket.emit("message", user, text.value);
        text.value = "";
    }
    
    if(file.files[0]){

        const reader = new FileReader();
        reader.addEventListener("load", (e) =>{
            socket.emit("enviarArchivo", user, e.target.result);
            /*let image = document.createElement("img");
            res.appendChild(image)
            image.style.width = "10rem";
            image.style.height = "15rem";
            image.src = data;
            console.log(e.target.result)*/
        })
        
        reader.readAsDataURL(file.files[0]);
        
        
    }
});

socket.on("mensajeGrupal", data => {
    console.log(data);
    let newMessage = "";
    data.forEach( message => {
        newMessage += `<p style = "display: flex; margin-top: 2px; flex-wrap: nowrap;">${message} </p>`;
    })
    res.innerHTML = newMessage;
    
});

socket.on("archivoRecibido", data => {
    //console.log(data);
    let newMessage = "";
    data.forEach( message => {
        newMessage += `<p style = "display: flex; margin-top: 2px; flex-wrap: nowrap;">${message}</p>`;
    })
    res.innerHTML = newMessage;
    /*let image = document.createElement("img");
    res.appendChild(image)
    image.src = data;
    image.style.width = "10rem";
    image.style.height = "15rem";*/
    file.value = "";
})