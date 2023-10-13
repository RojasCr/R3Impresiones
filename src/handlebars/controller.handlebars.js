const { Router } = require("express");
const { io } = require("../server/socketServer")
const productsModel = require("../dao/models/products.model");
const messagesModel = require("../dao/models/messages.model");
const MongoProductManager = require("../dao/mongoManager/MongoProductManager");
const MongoCartManager = require("../dao/mongoManager/MongoCartManager");
const productManager = new MongoProductManager();
const cartManager = new MongoCartManager();
const manejadorDeProductos = require("../dao/filesManager/productManager");
const passport = require("passport");

const router = Router();


//Middlewares
const publicAcces = (req, res, next) => {
    // if(req.session.user){
    //     return res.redirect("/products")
    // }
    if(req.cookies.user){
        return res.redirect("/products")
    }
    // if(req.user){
    //     return res.redirect("/products")
    // }
    next();
}
const privateAcces = (req, res, next) => {
    // if(!req.session.user){
        //     return res.redirect("/login")
        // }
        if(!req.cookies.user){
                return res.redirect("/")
        }
        // if(!req.user){
        //     return res.redirect("/")
        // }        
    next();
}

router.get("/", (req, res) => {
    try{
        /*const products = await productsModel.find();

        const productsStr = JSON.stringify(products);
        const productsObj = JSON.parse(productsStr);
        res.render("home", { products: productsObj});
*/
        res.redirect("/login");
    } catch(err){
        throw new Error(err);
    }
});

const handlePolicies = (policies) => {
    if(policies[0] === "PUBLIC"){
        return (req, res, next) => {
            next();
        }
    }

    return async(req, res, next) => {
        passport.authenticate("jwt", function(err, user, info){
            if(err){
                return next(err);
            }

            if(!user){
                return res.status(401).send({error: info.messages ? info.messages : "Ocurrió un error en la validación"})
            }

            if(user.role !== policies[0]){
                return res.status(403).send({error: "Forbidden: No tienes permiso para entrar."})
            }
            
            req.user = user;
            next();
        })(req, res, next);
    }
}


router.get("/products", /*privateAcces,*/handlePolicies(["USER"]), async(req, res) => {
    let { limit, page, sort, query } = req.query;
    const  user  = req.cookies.user;
    //console.log(req.user)
    //const userStr = JSON.stringify(user);
    //const userObj = JSON.parse(userStr)
    // let products = await manejadorDeProductos.getProducts();
    // if(!limit){
    //     return res.json(products);
    // }
    // let productsLimit = await products.slice(0, limit);
    // res.json(productsLimit);
    let response = await productManager.getProducts(limit, page, sort, query);
    const orden = sort? `&sort=${sort}` : "";
    const filter = query? `&query=${query}` : "";
    
    const products = {
        status: response ? "succes" : "error",
        payload: response.docs,
        totalPages: response.totalPages,
        prevPage: response.prevPage,
        nextPage: response.nextPage,
        page: response.page,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        prevLink: response.hasPrevPage? `localhost:8080/products?limit=${limit||10}&page=${Number(response.page) - 1}${orden + filter}` : null,
        nextLink: response.hasNextPage? `localhost:8080/products?limit=${limit||10}&page=${Number(response.page) + 1}${orden + filter}` : null
    }

    const productsStr = JSON.stringify(products);
    const productsObj = JSON.parse(productsStr);
    return res.render("products", {products: productsObj, user, style: "css/productos.css", limit: limit});
});

router.get("/products/description", handlePolicies(["ADMIN"]),async(req, res) => {
    const { pid } = req.query;
    const product = await productManager.getProductbyId(pid);
    const productStr = JSON.stringify(product);
    const productObj = JSON.parse(productStr);

    res.render("productDescription", {product: productObj})
});

router.get("/carts/:cid", async(req, res) => {
    const { cid } = req.params;
    const cartId = await cartManager.getCartById(cid);
    const cartStr = JSON.stringify(cartId);
    const cartObj = JSON.parse(cartStr);

    res.render("cart", {cart: cartObj})
});

router.get("/realTimesProducts", (req, res) => {
        res.render("realTimesProducts", {});
});

router.get("/chat", (req, res) => {
    res.render("chat", {style: "css/index.css"});
})

//REGISTRO, LOGIN


router.get("/signup", publicAcces, (req, res) => {
    res.render("signup")
});

router.get("/login", publicAcces, (req, res) => {
    res.render("login")
});

router.get("/restorePassword", (req, res) => {
    //const { user } = req.session;
    res.render("restorePassword", {});
})



//Local
const clientes = [];
const messages = [];

//DataBase


io.on("connect", async (socket) => {

    clientes.push(socket);

    clientes.forEach( cliente => {
        cliente.id = clientes.indexOf(cliente) + 1;
    })
    console.log(`Cliente ${socket.id} conectado`);
    

    //RealTimesProducts
    const products = await manejadorDeProductos.getProducts();
    socket.emit("productos", products);

    router.post("/realTimesProducts/api/products", async (req, res) => {
            const { title, description, price, thumbail, code, stock, category} = req.body;
            const product = [
                title,
                description,
                price, 
                thumbail,
                code,
                stock,
                category
            ]
            const added = await manejadorDeProductos.addProduct(...product);
            const products = await manejadorDeProductos.getProducts();
            if(added === false){
                return `producto no agregado`;
            }
            io.emit("post", products[products.length-1]);
    });
        
    router.delete("/realTimesProducts/api/products/:pid", async(req, res) => {
            const { pid } = req.params;
            const deleted = await manejadorDeProductos.deleteProduct(pid);
            if(deleted === false){
                return `product not found`
            }
            const products = await manejadorDeProductos.getProducts();
            io.emit("productos", products);
    });
    //

    //Chat
    socket.emit("mensajeGrupal", messages);

    socket.on("message", async (data1, data2) => {
        //console.log(data);
        const newMessage = {
            user: data1,
            message: data2
        }
        let message = `User ${data1}: ${data2}`
        messages.push(message);
        await messagesModel.create(newMessage);
        io.emit("mensajeGrupal", messages);
    });
    socket.on("enviarArchivo", async (data1, data2) => {
        //console.log(data1);
        //console.log(data2);
        const newMessage = {
            user: data1,
            message: data2
        }
        let message = `User ${data1}: <img src=${data2} style = "width: 10rem; heigth: 20rem;">`
        messages.push(message);
        await messagesModel.create(newMessage);
        io.emit("archivoRecibido", messages);
    });



    socket.on("disconnect", () => {
        console.log(`Cliente ${socket.id} desconectado`);
    });
});




//module.exports = router;