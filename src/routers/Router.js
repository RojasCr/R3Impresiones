//const productsController = require("../controllers/products/controller.products");
//const cartsController = require("../controllers/carts/controller.carts");
//const handlebarsController = require("../handlebars/controller.handlebars")
//const userController = require("../controllers/users/controller.user")
//const authController = require("../auth/auth")

const CustomControllerUsers = require("../controllers/users/customController.user")
const customUsersController = new CustomControllerUsers();

const CustomControllerCarts = require("../controllers/carts/customController.carts")
const customCartsController = new CustomControllerCarts();

const CustomControllerProducts = require("../controllers/products/customController.products")
const customProductsController = new CustomControllerProducts();

const CustomControllerAuth = require("../auth/customController.auth")
const customAuthController = new CustomControllerAuth();

const CustomControllerHandlebars = require("../handlebars/customController.handlebars");
const customHandlebarsCOntroller = new CustomControllerHandlebars();

const swaggerConfig = require("../utils/swagger.utils");

const swaggerUiExpress = require("swagger-ui-express");

const router = (app) => {
    //Middlewares
    app.use("/api/products", customProductsController.getRouter());
    app.use("/api/carts", customCartsController.getRouter());
    //app.use("/", handlebarsController);

    //app.use("/users", userController)
    //app.use("/auth", authController)

    app.use("/auth", customAuthController.getRouter());
    app.use("/api/users", customUsersController.getRouter());
    app.use("/", customHandlebarsCOntroller.getRouter());
    
    app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerConfig()))
}

module.exports = router;