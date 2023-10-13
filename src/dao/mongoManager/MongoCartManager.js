const productsModel = require("../mongo/models/products.model")
const cartsModel = require("../mongo/models/carts.model")

class MongoCartManager{
    addCart = async () => {
        try {
            const carts = await cartsModel.find();
            const cartsLength = carts.length;
    
            const newCart = {
                id: 1,
                products: []
            };
    
            if(cartsLength !== 0){
                newCart.id = carts[cartsLength - 1].id + 1;
            }
    
            const cartCreated = await cartsModel.create(newCart);
            return {message: `Cart created with id ${newCart.id}`, result: cartCreated._id}
        } catch (err) {
            throw new Error(err);
        }
    }

    getCartById = async (cid) => {
        try{
            const cartId = await cartsModel.findOne({id: cid}).populate("products.product");

            if(!cartId){
                return `Cart not found`;
            }

            return cartId;
        } catch (err){
            throw new Error(err);
        }

    }

    getById = async (id) => {
        try {
            const cart = await cartsModel.findById(id);
            return cart;
        } catch (error) {
            throw error
        }
    }

    addProductToCart = async(cid, pid) => {
        try{
            
            const producto = await productsModel.findOne({id: pid});

            /*if(producto.stock === 0){
                return `Producto sin stock`;
            }*/

            const productToAdd = {
                product : producto._id,
                quantity: 1
            }
            
            const cart = await cartsModel.findOne({id: cid});
            const productRepeated = cart.products.find(p => String(p.product) === String(producto._id));
            if(productRepeated){
                const newQuantity = productRepeated.quantity + 1;
                await cartsModel.updateOne({id: Number(cid), "products.product": String(producto._id)}, {$set: {"products.$.quantity": newQuantity}});
                const result = await cartsModel.findOne({id: cid});
                return result;
            } else {
                cart.products.push(productToAdd);
                await cartsModel.updateOne({id: Number(cid)}, cart);
                const result = await cartsModel.findOne({id: cid});
                console.log(result)
                return result;
            }
            
        } catch (err){
            throw new Error(err);
        }
    };
    
    updateOne = async(cid, prod) => {
        try {
            const response = await cartsModel.updateOne({id: cid}, {products: prod});
            return response;
        } catch (error) {
            throw error
        }
    }
    
    
    //****Preguntar****
    updateCart = async (cid, pid) => {
        try {
            const cart = await cartsModel.findOne({id: Number(cid)});
            const update = [];
            pid.forEach(async (id) => {
                const producto = await productsModel.findOne({id: Number(id)});
                const product = {
                    product: producto._id,
                    quantity:1
                }
                update.push(product);
                await cartsModel.updateOne({id: Number(cid)}, {$set: {products: update}})
            })
            
            if(cart){
                return `Products updated`;
            }else {
                return `Cart not found`;
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    
    updateQuantity = async (cid, pid, quan) => {
        try {
            const cart = await cartsModel.findOne({id: cid});
            const producto = await productsModel.findOne({id: Number(pid)});
            const product = cart.products.find(p => String(p.product) === String(producto._id));
            if(product){
                await cartsModel.updateOne({id: Number(cid), "products.product": String(producto._id)}, {$set: {"products.$.quantity": Number(quan)}});
                return `Cantidad aumentada`;
            }else{
                return `Product not found`;
            }
        } catch (error) {
            throw new Error(error);
        }
        
    }
    
    deleteCart = async (cid) => {
        try {
            const cart = await cartsModel.findOne({id: Number(cid)});
            await cartsModel.updateOne({id: Number(cid)}, {$set: {products: []}});
            return `Products deleted from cart ${cart.id}`;
        } catch (error) {
            throw new Error(error);
        }

    }
    
    deleteProductFromCart = async (cid, pid) => {
        try {
            const cartCid = await cartsModel.findOne({id: Number(cid)});
            const producto = await productsModel.findOne({id: Number(pid)})
            const productToDelete = cartCid.products.find(p => String(p.product) === String(producto._id));
            if(!productToDelete){
                return `Product not found`;
            }
            await cartsModel.updateOne({id: Number(cid)}, {$pull: {products: productToDelete}})
            return `Product deleted`;
            
        } catch (error) {
            throw Error(error);
        }
    }
}


module.exports = MongoCartManager;