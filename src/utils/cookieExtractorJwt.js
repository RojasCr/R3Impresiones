const cookieExtractor = (req) => {
    
    var token = null;
    if (req && req.cookies){
        token = req.cookies['jwt'];
    }
    return token;
};

module.exports = cookieExtractor;