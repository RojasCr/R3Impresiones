const trabajos = document.getElementById("trabajos");
const siguienteBtn = document.getElementById("siguiente");
const anteriorBtn = document.getElementById("anterior");
const fondo = document.getElementById("fondo");
const contfondo = document.getElementById("contenedor_fondo");
const nosotros = document.getElementById("nosotros");

const volverInicioBtn = document.getElementById("volverInicio");


//let fondos = 1;

siguienteBtn.addEventListener("click", () => {
    // fondo.style.animationName="none"
    
    
    fondo.style.animationName = "desapareceIzquierda";
    
    //console.log(fondo.src)
    if(fondo.src === "http://localhost:8080/images/Productos/Logo_R3.png"){
        //fondos++ 
        
        
        //fondo.style.animationPlayState="running"
        setTimeout(() => {
            fondo.src = "http://localhost:8080/images/Productos/Banner.jpg";
            fondo.style.animationName = "apareceIzquierda";
        }, 2000)
        
        //fondo.style.animationName = "5s"
        return
    }
    
    if(fondo.src === "http://localhost:8080/images/Productos/Banner.jpg"){
        //fondos++ 
        
        
        //fondo.style.animationPlayState="running"
        setTimeout(() => {
            fondo.src = "http://localhost:8080/images/Productos/Logo_R3.png";
            fondo.style.animationName = "apareceIzquierda";
        }, 2000)
        
        //fondo.style.animationName = "5s"
        return
    }
    
})


anteriorBtn.addEventListener("click", () => {
    fondo.style.animationName = "desapareceIzquierda";
    
    //console.log(fondo.src)
    if(fondo.src === "http://localhost:8080/images/Productos/Logo_R3.png"){
        //fondos++ 
        
        
        //fondo.style.animationPlayState="running"
        setTimeout(() => {
            fondo.src = "http://localhost:8080/images/Productos/Banner.jpg";
            fondo.style.animationName = "apareceIzquierda";
        }, 2000)
        
        //fondo.style.animationName = "5s"
        return
    }
    
    if(fondo.src === "http://localhost:8080/images/Productos/Banner.jpg"){
        //fondos++ 
        
        
        //fondo.style.animationPlayState="running"
        setTimeout(() => {
            fondo.src = "http://localhost:8080/images/Productos/Logo_R3.png";
            fondo.style.animationName = "apareceIzquierda";
        }, 2000)
        
        //fondo.style.animationName = "5s"
        return
    }
   
})
