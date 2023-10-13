const { persistence } = require("../config/app.config");
const mongoConnect = require("../db");

switch (persistence) {
    case "memory":
        module.exports = require("../dao/memory/MemoryUserDao")
    break;
    
    case "mongo":
        mongoConnect();
        module.exports = require("../dao/mongoManager/MongoUserDao")
    break;
}