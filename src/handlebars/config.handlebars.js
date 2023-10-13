const handlebars = require("express-handlebars");

const handlebarsConfig = (app) => {
    app.engine("handlebars", handlebars.engine());
    app.set("views", __dirname + "/../views");
    app.set("view engine", "handlebars");
}

module.exports = handlebarsConfig;