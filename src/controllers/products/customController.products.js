const customRouter = require("../../routers/CustomRouter");

const manejadorDeProductos = require("../../dao/filesManager/productManager");
const productsModel = require("../../dao/mongo/models/products.model");
const MongoProductManager = require("../../dao/mongoManager/MongoProductManager");
const createMock = require("../../utils/mocks/productsMock");
const productError = require("../../utils/errors/product/product.error");
const SendMail = require("../../utils/nodeMailer/nodeMailer");
//const errorHandler = require("../../middlewares/errors");
const productManager = new MongoProductManager();


class ProductsRouter extends customRouter{
    init(){

        this.get("/", ["PUBLIC"], async (req, res) =>{
            try {
                let { limit, page, sort, query } = req.query;
            
                let response = await productManager.getProducts(limit, page, sort, query);
            
                const products = {
                    status: response ? "success" : "error",
                    payload: response.docs,
                    totalPages: response.totalPages,
                    prevPage: response.prevPage,
                    nextPage: response.nextPage,
                    page: response.page,
                    hasPrevPage: response.hasPrevPage,
                    hasNextPage: response.hasNextPage,
                    prevLink: response.hasPrevPage? `localhost:8080/api/products?page=${Number(page)-1}` : null,
                    nextLink: response.hasNextPage? `localhost:8080/api/products?page=${Number(page)+1}` : null
                }
    
                return res.sendSuccess(products);
            } catch (error) {
                req.logger.fatal("Poductos no encontrados")
            }
        });
        
        this.get("/mockingproducts", ["PUBLIC"], (req, res) => {
            const products = createMock(100);
            res.sendSuccess(products);
        })

        this.get("/:pid", ["PUBLIC"], async (req, res) => {
            try {
                const { pid } = req.params;
    
                //productError(Number(pid));
    
                const response = await productManager.getProductbyId(pid);
                
                res.sendSuccess(response);
                
            } catch (error) {
                req.logger.error(error.cause)
                res.sendServerError(error)
            }
        });

        this.post("/", ["ADMIN", "PREMIUM"], async (req, res) => {
            try{
                
                const { title, description, price, thumbail, code, stock, category} = req.body;
                
                if(!title || !description || !price || !thumbail || !code || !stock || !category){
                    return productError(null, { title, description, price, thumbail, code, stock, category})
                }

                const currentUser = req.user
                
                const product = {
                    title,
                    description,
                    price, 
                    thumbail,
                    code,
                    stock,
                    category,
                    owner: currentUser.email
                }   

                const result = await productManager.addProduct(product);
               
                res.sendSuccess(`Producto agregado con id: ${result.id}`);
                    
            } catch(error){
                req.logger.error(error)
                console.log(error);
                res.sendUserError(error) 
            }
        });

        this.post("/loadProducts", ["ADMIN"],async (req, res) => {
            try{
                await productsModel.deleteMany();
                const products = await manejadorDeProductos.getProducts();
                //products.owner = "ADMIN";
                await productsModel.insertMany(products);
                res.sendSuccess("Productos agregados a DB");
            } catch (err) {
                throw new Error(err);
            }
        });

        this.put("/:pid", ["ADMIN", "PREMIUM"],async (req, res) => {
            try {
                const { pid } = req.params;
                const { title, description, price, thumbail, code, stock, category} = req.body;
                
                if(!title || !description || !price || !thumbail || !code || !stock || !category){
                    return productError(null, { title, description, price, thumbail, code, stock, category})
                }
                
                const product = {
                    id: pid,
                    title,
                    description,
                    price, 
                    thumbail,
                    code,
                    stock,
                    category
                };


                const result = await productManager.updateProduct(pid, product);
                res.sendSuccess(result);
            } catch (error) {
                req.logger.error(error.cause)
                //console.log(error.cause);
                res.sendUserError(error.name)
            }
            
        });
        
        this.delete("/:pid", ["ADMIN", "PREMIUM"], async(req, res) => {
            try {
                const { pid } = req.params;
                const currentUser = req.user
                
                const currentProduct = await productManager.getProductbyId(pid);
                
                if(currentProduct.owner === currentUser.email || currentUser.role === "ADMIN"){
                    const response = await productManager.deleteProduct(pid);
                    SendMail.productDeleted(currentProduct.owner, currentProduct.title)
                    return res.sendSuccess(response);
                }
                
                return res.sendUserError("Este producto no es tuyo")
            } catch (error) {
                console.log(error)
                req.logger.error(error.cause)
            }
            // const { pid } = req.params;
            // await manejadorDeProductos.deleteProduct(pid);
        });

    }
}

module.exports = ProductsRouter;