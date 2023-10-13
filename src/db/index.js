const mongoose = require("mongoose")
const { dbUser, dbPassword, dbHost, dbName } = require("../config/db.config");
//const CustomError = require("../utils/errors/customErrors.js");
const generateErrorInfo = require("../utils/errors/infoError");
const enumErrors = require("../utils/errors/enumErrors");
const CustomError = require("../utils/errors/customErrors");

const mongoConnect = async () => {
    try {
        if(!dbUser || !dbPassword || !dbHost || !dbName){
            CustomError.createError({
                name: "Error al conectar con DB",
                message: "Variables de entorno no válidas",
                code: enumErrors.DATABASE_ERROR,
                cause: generateErrorInfo(enumErrors.DATABASE_ERROR, {dbUser, dbPassword, dbHost, dbName})
            })
        }


        mongoose.set("strictQuery", false);
        const isConnected = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`
        );
        
        
        console.log("DB connected", dbName);
    } catch (error) {
        throw error
    }
}

module.exports = mongoConnect;
