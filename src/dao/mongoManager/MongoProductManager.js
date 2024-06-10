
const productError = require("../../utils/errors/product/product.error");
const productModel = require("../mongo/models/products.model");

class MongoProductManager{
    getProducts = async (limit, page, sort, query) => {
        try{
            //const { limit } = req.query;
            const asc = 1;
            const desc = -1;
            const none = 0;

            let filtrado = {};
            if(query && query == "available"){
                filtrado = {stock: {$gt: 0}}
                
            }
            if(query && query !== "available"){

                filtrado = {category: query}
            }
            

            const productsLimit = await productModel.paginate(filtrado, {limit: limit || 10, page: page || 1, sort: {price: sort } || none});
            return productsLimit;
        } catch(err){
            throw new Error(err);
        }
    }

    getProductbyId = async(pid) => {
        try {
            
            const product = await productModel.findOne({id: pid});
            //const productsLength = await productsModel.count();
            if(!product){
                //throw new Error(error);
                return productError(pid)
            }
            return product;
        } catch (error) {
            throw new Error(error);
        }
    }

    getByMongoId = async(id) => {
        try {
            const product = await productModel.findById(id);
            if(!product){
                return `Product not found`;
            }
            return product;
        } catch (error) {
            throw new Error(error);
        }
    }

    addProduct = async (product) => {
        try{
        
            const products = await productModel.find();

            if(products.length !== 0){
                product.id = products[products.length - 1].id + 1;
            } else {
                product.id = 1;
            }

            
            const added = await productModel.create(product);
            return added;
            //res.send(`Producto agregado con id: ${added.id}`);
            
        } catch(err){
            //console.log(err.cause)
            throw new Error(err);
        }
    }

    updateProduct = async (pid, product) => {
        try {
            
            const response = await productModel.updateOne({id: pid}, product);
            return response;
            //return res.json(response);
        } catch (error) {
            throw new Error(error);
        }
    }

    deleteProduct = async (pid) => {
        try {
            
            await productModel.deleteOne({id: pid});
            return `Product ${pid} deleted`;
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = MongoProductManager;