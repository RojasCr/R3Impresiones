const swaggerJsDoc = require("swagger-jsdoc");

const swaggerConfig = () => {
    const swaggerOptions = {
        definition: {
            openapi: "3.0.3",
            info: {
                title: "Documentación de e-commerce",
                description: "API para venta de productos",
                version: "1.0"
            }
        },
        apis: [`${process.cwd()}/src/docs/**/*.yaml`]
    }

    const specs = swaggerJsDoc(swaggerOptions);

    return specs;

}

module.exports = swaggerConfig;