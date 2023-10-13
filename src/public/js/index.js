const socket = io();
const listaProductos = document.getElementById("listaProductos");


socket.on("productos", (data) => {
    console.log(data);
    let lista = document.createElement("div");
    
    data.forEach(product => {
        let ul = document.createElement("ul");
        for(key in product){
            ul.innerHTML += `<li>${key}: ${product[key]}</li>`;
        }
        lista.appendChild(ul);
        
    })
    
    listaProductos.innerHTML = lista.innerHTML;
});

socket.on("post", data =>{
    
    console.log(data);
    
    let ul = document.createElement("ul");
    for(key in data){
        ul.innerHTML += `<li>${key}: ${data[key]}`;
    }
    listaProductos.appendChild(ul);
})