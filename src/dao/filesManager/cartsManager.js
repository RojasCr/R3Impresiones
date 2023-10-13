(async () => {
const fs = require("fs");

class CartsManager {
    carts = [];

    constructor(){
        this.products = [],
        this.path = __dirname + "/carts.json",
        this.productsPath = __dirname + "/../products/products.json",
        this.type = "utf-8"
    }

    async addCart(){
        try{
            
            //Si no existe carts.josn, se crea:
            if(!fs.existsSync(this.path)){
                const cartsStr = JSON.stringify(this.carts, null, " ");
                await fs.promises.writeFile(this.path, cartsStr);
            }
        
            //Se llama a carts.json:
            const cartsStr = await fs.promises.readFile(this.path, this.type);
            const cartsObj = JSON.parse(cartsStr);
                
            //Se crea el carrito y se agrega:
            const newCart = {
                id : 0,
                products: this.products
            }
            if(cartsObj.length === 0){
                    newCart.id = 1;
            } else {
                newCart.id = cartsObj[cartsObj.length - 1].id + 1;
            }
                
            cartsObj.push(newCart);
            const newCartsStr = JSON.stringify(cartsObj, null, " ");
            await fs.promises.writeFile(this.path, newCartsStr);

            return `Cart created`;
            
        } catch (err){
            throw new Error(err);
        }
    }

    async getCartById(cid){
        try{
            const cartsStr = await fs.promises.readFile(this.path,this.type);
            const cartsObj = JSON.parse(cartsStr);
    
            const cartId = cartsObj.find( c => c.id === Number(cid));

            if(!cartId){
                //console.log("Not found");
                return "Cart not found";
            }

            const productsCart = cartId.products;
            //console.log(productsCart);
            return productsCart;

        } catch (err){
            throw new Error(err);
        }


    }

    async addProductToCart(cid, pid){
        try{
            const cartsStr = await fs.promises.readFile(this.path, this.type);
            const cartsObj = JSON.parse(cartsStr);
            const productsStr = await fs.promises.readFile(this.productsPath, this.type);
            const productsObj = JSON.parse(productsStr);

            const cartId = cartsObj.find( c => c.id === Number(cid));
            const productId = productsObj.find( p => p.id === Number(pid));

            if(!cartId || !productId){
                //console.log("Cart or product not found");
                return "Cart or product not found";
            }

            const productToAdd = {
                product: productId.id,
                quantity: 1
            }

            
            const productRepeated = cartId.products.find( p => p.product === productId.id)
            if(productRepeated){
                //console.log("se repite");
                productRepeated.quantity += 1;
            } else {
                cartId.products.push(productToAdd);
            }
            

            const newCartsStr = JSON.stringify(cartsObj, null, " ");
            await fs.promises.writeFile(this.path, newCartsStr);

            return `Product ${pid} add to cart`;

        } catch (err){
            throw new Error(err);
        }
    }
}

const manejadorDeCarrito = new CartsManager();

//await manejadorDeCarrito.addCart();
//await manejadorDeCarrito.addCart();
//await manejadorDeCarrito.addCart();
//await manejadorDeCarrito.addCart();
//await manejadorDeCarrito.addCart();
//await manejadorDeCarrito.addCart();
//await manejadorDeCarrito.addProductToCart(4, 5);
//await manejadorDeCarrito.getCartById(3);

module.exports = manejadorDeCarrito;
})();

//console.log(__dirname + /*"./proyectoFinal_primeraEntrega/src/products*/"/..products.json")