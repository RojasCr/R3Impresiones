require("dotenv").config({
    path:`./.env.${process.env.NODE_ENV}`
});

module.exports = {
    clientIDGoogle: process.env.CLIENT_ID_GOOGLE,
    clientSecretGoogle: process.env.CLIENT_SECRET_GOOGLE,
    callBackUrlGoogle: process.env.CALLBACK_URL_GOOGLE
}