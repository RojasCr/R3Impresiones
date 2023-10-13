const redirector = (req, res, next) => {
    if(!req.cookies.jwt){
        return res.redirect("/login")
    }
    
    if(req.cookies.user){
        return next();
    }
}

module.exports = redirector;