const customRouter = require("../../routers/CustomRouter");
const { v4: uuidv4 } = require('uuid');

//const Users = require("../../repositories/index")
const MongoCartManager = require("../../dao/mongoManager/MongoCartManager");
const cartManager = new MongoCartManager();

//const MongoProductManager = require("../../dao/mongoManager/MongoProductManager");
const productModel = require("../../dao/mongo/models/products.model");
const userModel = require("../../dao/mongo/models/users.model");
const ticketsModel = require("../../dao/mongo/models/tickets.model");
//const productManager = new MongoProductManager();


class CartsRouter extends customRouter{
    init(){
        this.post("/", ["ADMIN"],async(req, res) => {
            try {
               const response = await cartManager.addCart();
               res.sendSuccess(response.message);
            } catch (error) {
                throw error;
            }
        });
        
        this.get("/:cid", ["ADMIN"],async(req, res) => {
            try {
                const { cid } = req.params;
                const response = await cartManager.getCartById(cid);
                res.sendSuccess(response);
            } catch (error) {
                throw error
            }
        });

        this.get("/:cid/purchase", ["USER", "PREMIUM"], async (req, res) => {
            try {
                const { cid } = req.params;
                const cart = await cartManager.getCartById(cid);
                const productsToPurchase = cart.products;

                const currentUser = req.cookies.user;

                const purchaseFilterAvailable = productsToPurchase.filter(p => p.product.stock !== 0);
                const purchaseFilterUnavailable = productsToPurchase.filter(p => p.product.stock === 0);

                purchaseFilterAvailable.forEach(async (p) => {
                    const productToSell = await productModel.findById(p.product._id)
                    productToSell.stock = productToSell.stock - p.quantity;
                    await productModel.updateOne({_id: p.product._id}, productToSell);
                })

                const newTicketInfo = {
                    code: uuidv4(),
                    purchase_datatime: new Date().toLocaleString(),
                    amount: purchaseFilterAvailable.reduce((acc, curr) => acc + curr.product.price*curr.quantity, 0),
                    purchaser: currentUser.email
                }

                const newTicket = await ticketsModel.create(newTicketInfo);

                if(newTicket){
                    await cartManager.updateOne(cid, purchaseFilterUnavailable);
                    const cartUpdated = await cartManager.getCartById(cid);
                    //const cartUpdated = await userModel.findOne({cart: cart._id})
                    currentUser.cart = cartUpdated;
                    currentUser.totalProducts = cartUpdated.products.reduce( (acc, curr) => acc + curr.quantity, 0)
                    console.log(cartUpdated)
                    res.cookie("user", currentUser, {httpOnly: true, secure: true}).sendSuccess(newTicket);
                }
                
                
                /**AGREGAR CASO DE COMPRA FALLIDA**/

            } catch (error) {
                throw error
            }
        })

        this.post("/:cid/product/:pid", ["USER", "PREMIUM"],async(req, res) => {
            try {

                const currentUser = req.cookies.user;
                const { cid, pid} = req.params;

                const currentProduct = await productModel.findOne({id: pid})

                if(currentProduct.owner === currentUser.email){
                    return res.sendUserError("No puedes agregar un producto que te pertenece")
                }
                const response = await cartManager.addProductToCart(cid, pid);


                currentUser.cart = response;
                currentUser.totalProducts = response.products.reduce( (acc, curr) => acc + curr.quantity, 0)

                console.log(currentUser)

                res.cookie("user", currentUser, {httpOnly: true, secure: true}).sendSuccess(response);
            } catch (error) {
                throw error;
            }
        })
        
        this.delete("/:cid/products/:pid", ["USER", "PREMIUM"],async (req, res) => {
            try {
                const { cid, pid } = req.params;
                const user = req.cookies.user
                const response = await cartManager.deleteProductFromCart(cid, pid);
                
                user.totalProducts -= 1;
                
                res.cookie("user", user, {httpOnly: true, secure: true}).sendSuccess(response);
            } catch (error) {
                throw error
            }
        });

        this.put("/put/:cid", ["PUBLIC"],async (req, res) => {
            try {
                const { cid } = req.params;
                const { pid } = req.body
                const response = await cartManager.updateCart(cid, pid);
                res.sendSuccess(response);
            } catch (error) {
                throw new Error(error);
            }
        });

        this.patch("/:cid/products/:pid", ["USER"],async (req, res) => {
            try {
                const { cid, pid } = req.params;
                const { quantity } = req.body;
        
                const response = await cartManager.updateQuantity(cid, pid, quantity);
                res.sendSuccess(response);
            } catch (error) {
                throw new Error(error);
            }
        });

        this.delete("/:cid", ["ADMIN"],async (req, res) => {
            try {
                const { cid } = req.params;
                const response = await cartManager.deleteCart(cid);
                res.sendSuccess(response);
            } catch (error) {
                throw new Error(error);
            }
        })
    }
}

module.exports = CartsRouter;