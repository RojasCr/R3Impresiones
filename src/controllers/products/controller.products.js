const { Router } = require("express");
const manejadorDeProductos = require("../../dao/filesManager/productManager");
const productsModel = require("../../dao/mongo/models/products.model");
const MongoProductManager = require("../../dao/mongoManager/MongoProductManager");
const productManager = new MongoProductManager();

const router = Router();

router.get("/", async (req, res) =>{
    let { limit, page, sort, query } = req.query;
    // let products = await manejadorDeProductos.getProducts();
    // if(!limit){
    //     return res.json(products);
    // }
    // let productsLimit = await products.slice(0, limit);
    // res.json(productsLimit);
    let response = await productManager.getProducts(limit, page, sort, query);
    
    const products = {
        status: response ? "succes" : "error",
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

    return res.json(products);
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    const response = await productManager.getProductbyId(pid);
    // let products = await manejadorDeProductos.getProducts();
    // let productPid = await manejadorDeProductos.getProductById(pid);
    // if(pid > products.length){
    //     return res.json({ message: "ERROR: This product doesn't exist"});
    // }
    res.json(response);
});

router.post("/", async (req, res) => {
    // try{

    //     const { title, description, price, thumbail, code, stock, category} = req.body;
    //     const product = {
    //         title,
    //         description,
    //         price, 
    //         thumbail,
    //         code,
    //         stock,
    //         category
    //     }
    //     //const added = await manejadorDeProductos.addProduct(...product);
    //     const added = await productsModel.create(product);
    //     //const products = await manejadorDeProductos.getProducts();
    //     res.send(`Producto agregado`);
        
    // } catch(err){
    //     throw new Error(err);
    // }
    productManager.addProduct(req, res);
});

router.post("/loadProducts", async (req, res) => {
    try{
        await productsModel.deleteMany();
        const products = await manejadorDeProductos.getProducts();
        await productsModel.insertMany(products);
        res.send("Productos agregados a DB");
    } catch (err) {
        throw new Error(err);
    }
});

router.put("/:pid", async (req, res) => {
    // const { pid } = req.params;
    // const { title, description, price, thumbail, code, stock, category} = req.body;
    // const product = [
    //     id= pid,
    //     title,
    //     description,
    //     price, 
    //     thumbail,
    //     code,
    //     stock,
    //     category
    // ];
    // await manejadorDeProductos.updateProduct(...product);
    productManager.updateProduct(req, res);
});

router.delete("/:pid", async(req, res) => {
    // const { pid } = req.params;
    // await manejadorDeProductos.deleteProduct(pid);
    productManager.deleteProduct(req, res);
});

module.exports = router;