const bcrypt = require("bcrypt");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const cryptPassword = password => {
    const cryptedPassword = bcrypt.hashSync(password, salt);
    return cryptedPassword;
}

const compareCrypt = (password, cryptedPassword) => {
    return bcrypt.compareSync(password, cryptedPassword);
}

module.exports = { cryptPassword, compareCrypt};