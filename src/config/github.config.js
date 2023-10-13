require("dotenv").config({
    path:`./.env.${process.env.NODE_ENV}`
});

module.exports = {
    clientIDGithub: process.env.CLIENT_ID_GITHUB,
    clientSecretGithub: process.env.CLIENT_SECRET_GITHUB,
    callBackUrlGithub: process.env.CALLBACK_URL_GITHUB
}