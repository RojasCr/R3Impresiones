const { Router } = require("express");

const MongoCartManager = require("../../dao/mongoManager/MongoCartManager");
const cartManager = new MongoCartManager;

const router = Router();

router.post("/", async(req, res) => {
    //const response = await manejadorDeCarrito.addCart();
    
    // const newCart = {
    //     id: 3,
    //     products: []
    // }
    // const response = await cartsModel.create(newCart);
    // res.json({ message: response});
    try {
        const response = await cartManager.addCart();
        res.send(response.message);
    } catch (error) {
        throw new Error(error)
    }
});

router.get("/:cid", async(req, res) => {
    try {
        const { cid } = req.params;
        /*const cart = await manejadorDeCarrito.getCartById(cid);
        res.json(cart);*/
        const response = await cartManager.getCartById(cid);
        res.json(response);
    } catch (error) {
        throw new Error(error);
    }
});

router.post("/:cid/product/:pid", async(req, res) => {
    try {
        const { cid, pid} = req.params;
        const response = await cartManager.addProductToCart(cid, pid);
        res.json(response);
    } catch (error) {
        throw new Error(error);
    }
    //cartManager.addProductToCart(req,res);
});

router.delete("/:cid/products/:pid", async(req, res) => {
    const { cid, pid } = req.params;
    const response = await cartManager.deleteProductFromCart(cid, pid);
    res.send(response);
});

//****PREGUNTAR****// 
router.put("/put/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { pid } = req.body
        const response = await cartManager.updateCart(cid, pid);
        res.send(response);
    } catch (error) {
        throw new Error(error);
    }
});

router.patch("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const response = await cartManager.updateQuantity(cid, pid, quantity);
        res.send(response);
        
    } catch (error) {
        throw new Error(error);
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const response = await cartManager.deleteCart(cid);
        res.send(response);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = router;