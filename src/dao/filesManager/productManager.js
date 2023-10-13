
const fs = require("fs");

class ProductManager {
    products = [];
    
    constructor(){
        //this.id = 0;
        this.path = `${process.cwd()}/src/files/products.json`;
        this.type = "utf-8";
    } 

    
    
    //Método para agregar productos
    async addProduct(title, description, price, thumbail, code, stock, category){
        //this.id = this.id + 1;
        
        let producto = {
            id: 0,
            title,
            description,
            price,
            thumbail,
            code,
            stock,
            status: true,
            category
        }

        try{

            
            //Validaciones
            
            
            let resultado = await fs.promises.readFile(this.path, this.type);
            //let resultadoStr1 = resultado;
            let resultadoObj = JSON.parse(resultado);
            
            let repetido = resultadoObj.find( c => c.code == code);
            if(repetido){
                console.log(`El code ya existe`);
                return false;
            }
            if(!title || !description || !price || !thumbail || !code || !stock || !category){
                console.log(`Faltan datos`);
                return false;
            }
            
            //Agregar producto a products
            if(resultadoObj.length == 0){
                producto.id = 1
            } else {
                producto.id = resultadoObj[resultadoObj.length - 1].id + 1;
            }

            resultadoObj.push(producto);
            
            
            
            //Guardarlo en archivo json
            let resultadoStr2 = JSON.stringify(resultadoObj, null, " ");
            await fs.promises.writeFile(this.path, resultadoStr2);
            
            
            console.log(`Producto agregado con id: ${producto.id}`);
            
        } catch (err){
            //console.log(err)
            throw new Error(err);
        }
        
    }
    
    //Método para obtener el arreglo products
    async getProducts(){
        try{
            if(!fs.existsSync(this.path)){
                
                let productsStr = JSON.stringify(this.products, null, " ");
                await fs.promises.writeFile(this.path, productsStr);
            } 
            if(fs.existsSync(this.path)){
                const resultado = await fs.promises.readFile(this.path, this.type);
                const resultadoStr =  resultado;
                const resultadoObj = await JSON.parse(resultadoStr);
                //console.log(resultadoObj);
                return resultadoObj;
            }
        } catch (err) {
            throw new Error(err);    
        }
    }
        
    //Método para obtener un producto por id
    async getProductById(i){
        try{
            let resultado = await fs.promises.readFile(this.path, this.type);
            let resultadoObj = await JSON.parse(resultado);
            let producto = resultadoObj.find( p => 
                p.id == i
                );
    
                if(producto){
                    //console.log(producto);
                    return producto;
                } else {
                    //console.log(`Not found`);
                    return `Not found`;
                }
        } catch (err){
                throw new Error(err);
        }
    }
        
    async updateProduct(i, title, description, price, thumbail, code, stock, category){
        try{
            let resultado = await fs.promises.readFile(this.path, this.type);
            let resultadoObj = await JSON.parse(resultado);
            
            let producto = resultadoObj.find( p => 
                p.id == i
            );
                    
            let productoActualizado = {
                id: i,
                title,
                description,
                price,
                thumbail,
                code,
                stock,
                category
            };
                    
            if(producto){
                console.log(producto);
                let productoIndice = resultadoObj.indexOf(producto);
                //console.log(productoIndice);
                resultadoObj[productoIndice] = productoActualizado;
                console.log(productoActualizado);
                
                //Guardarlo en archivo json
                let actualizadoStr = JSON.stringify(resultadoObj, null, " ");
                await fs.promises.writeFile(this.path, actualizadoStr);
                return;
            } else {
                console.log(`Not found`);
                return `Not found`;
            }
        } catch (err){
            throw new Error(err);
        }
    }
    
    async deleteProduct(i){
        try{
            let resultado = await fs.promises.readFile(this.path, this.type);
            let resultadoObj = await JSON.parse(resultado);
            
            let producto = resultadoObj.find( p => 
                p.id == i
            );
        
            if(producto){
                //console.log(producto);
                let productoIndice = resultadoObj.indexOf(producto);
                //console.log(productoIndice);
                resultadoObj.splice(productoIndice, 1);
                console.log(`Producto ${i} eliminado`);
                
                //Guardarlo en archivo json
                let actualizadoStr = JSON.stringify(resultadoObj, null, " ");
                await fs.promises.writeFile(this.path, actualizadoStr);
                return `producto eliminado`;
                
            } else {
                console.log(`Not found`);
                return false;
            }
        } catch (err){
            throw new Error(err);
        }
    }
}

const manejadorDeProductos = new ProductManager();

  

//manejadorDeProductos.getProducts();
//manejadorDeProductos.addProduct("bolstrap", "bolsa", 100, "url", "code41", 1000);
//manejadorDeProductos.getProducts();
//manejadorDeProductos.getProductById(1);
//manejadorDeProductos.updateProduct(1, "manaos", "bebida", 5500, "url1", "code1578", 9000);
//manejadorDeProductos.deleteProduct(1);


module.exports = manejadorDeProductos;