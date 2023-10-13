const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

const initializePassport = require("../config/passport.config");
const mongoSessions = require("../db/sessions");
const loggerMiddleware = require("../middlewares/logger.middlewares");
const router = require("../routers/Router");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + "/../public"));
app.use(cookieParser());

app.use(loggerMiddleware)


app.use(session(mongoSessions()))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//Se ejecuta router(app)
router;


module.exports = { server, io, app };