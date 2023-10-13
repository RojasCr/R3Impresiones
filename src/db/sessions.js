const MongoStore = require("connect-mongo");
const { dbUser, dbPassword, dbHost, dbName, dbSessionName, dbSessionSecret } = require("../config/db.config");

const mongoSessions = () => {
    try {
        const options = {
            store: MongoStore.create({
                mongoUrl:`mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbSessionName}?retryWrites=true&w=majority`,
                mongoOptions:{useNewUrlParser: true},
                
            }),
            secret: dbSessionSecret,
            resave: false,
            saveUninitialized: false
        }
        return options;
    } catch (error) {
        throw error
    }
}

module.exports = mongoSessions