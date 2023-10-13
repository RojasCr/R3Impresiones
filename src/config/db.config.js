require("dotenv").config();

const dbCredentials = {
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    dbSessionName: process.env.DB_SESSION_NAME,
    dbSessionSecret: process.env.DB_SESSION_SECRET
}

module.exports = dbCredentials;