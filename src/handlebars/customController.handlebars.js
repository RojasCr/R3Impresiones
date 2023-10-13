const CustomRouter = require("../routers/CustomRouter");
const { io } = require("../server/socketServer")
const jwt = require("jsonwebtoken");

const messagesModel = require("../dao/mongo/models/messages.model");
const MongoProductManager = require("../dao/mongoManager/MongoProductManager");
const MongoCartManager = require("../dao/mongoManager/MongoCartManager");
const manejadorDeProductos = require("../dao/filesManager/productManager");
const Users = require("../repositories");
const redirector = require("../middlewares/autentication.middleware");


const productManager = new MongoProductManager();
const cartManager = new MongoCartManager();
//const passport = require("passport");



class HandlebarsRouter extends CustomRouter{
    init(){

        this.get("/adminPanel", ["ADMIN"], async(req, res) => {
            try {
                const users = await Users.findAll();

                const usersStr = JSON.stringify(users)
                const usersInfo = JSON.parse(usersStr)

                res.render("adminPanel", {usersInfo});
                
            } catch (error) {
                throw new Error(error)
            }
        })

        this.get("/", ["PUBLIC"], (req, res) => {
            try{
                res.redirect("/products");
            } catch(err){
                throw new Error(err);
            }
        });

        this.get("/products", ["USER", "ADMIN", "PREMIUM"], async(req, res) => {
            let { limit, page, sort, query } = req.query;
            const user = req.cookies.user;
            
            let response = await productManager.getProducts(limit, page, sort, query);
            const orden = sort? `&sort=${sort}` : "";
            const filter = query? `&query=${query}` : "";
            
            const products = {
                status: response ? "success" : "error",
                payload: response.docs,
                totalPages: response.totalPages,
                prevPage: response.prevPage,
                nextPage: response.nextPage,
                page: response.page,
                hasPrevPage: response.hasPrevPage,
                hasNextPage: response.hasNextPage,
                prevLink: response.hasPrevPage? `/products?limit=${limit||10}&page=${Number(response.page) - 1}${orden + filter}` : null,
                nextLink: response.hasNextPage? `/products?limit=${limit||10}&page=${Number(response.page) + 1}${orden + filter}` : null
            }
        
            const productsStr = JSON.stringify(products);
            const productsObj = JSON.parse(productsStr);

            //console.log(user)
            return res.render("products", {products: productsObj, user, style: "css/productos.css", limit: limit});
        });

        this.get("/products/description", ["USER", "PREMIUM", "ADMIN"],async(req, res) => {
            const { pid } = req.query;
            const user = req.cookies.user

            const product = await productManager.getProductbyId(pid);
            const productStr = JSON.stringify(product);
            const productObj = JSON.parse(productStr);
        
            return res.render("productDescription", {product: productObj, user/*, style: "css/product.css"*/})
        });

        this.get("/carts", ["USER", "PREMIUM", "ADMIN"],async(req, res) => {
            let { id } = req.query;
            const cartId = await cartManager.getCartById(id);
            const cartStr = JSON.stringify(cartId);
            const cartObj = JSON.parse(cartStr);
        
            res.render("cart", {cart: cartObj, style: "css/cart.css"})
        });

        this.get("/purchase", ["USER", "PREMIUM", "ADMIN"], async(req, res) => {
            try {
                res.render("purchase");
            } catch (error) {
                throw new Error(error)
            }
        })

        this.get("/realTimesProducts", ["USER"],(req, res) => {
            res.render("realTimesProducts", {});
        });

        this.get("/chat", ["USER"], (req, res) => {
            res.render("chat", {style: "css/index.css"});
        });

        //REGISTRO, LOGIN


        this.get("/signup", ["PUBLIC"],(req, res) => {
            res.render("signup", {style: "css/signup.css"})
        });

        this.get("/login", ["PUBLIC"], (req, res) => {
            res.render("login", {style: "css/login.css"});
        });

        this.get("/restore", ["PUBLIC"], (req, res) => {
            res.render("sendMail", {style: "css/sendMail.css"})
        })

        this.get("/restorePassword", ["PUBLIC"], (req, res) => {
            //const { restoringMail } = req.cookies;
            const { token } = req.query;

            jwt.verify(token, "secretMail", (error) => {
                if(error){
                    return res.redirect("/restore")
                }
            });
            res.render("restorePassword", {style: "css/restorePassword.css"});

            
        });

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

			this.post("/realTimesProducts/api/products", async (req, res) => {
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
				
			this.delete("/realTimesProducts/api/products/:pid", async(req, res) => {
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

	}
}

module.exports = HandlebarsRouter;