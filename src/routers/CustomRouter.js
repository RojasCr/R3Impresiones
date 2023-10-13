const {Router} = require("express");
const passport = require("passport");
const redirector = require("../middlewares/autentication.middleware");

class CustomRouter{
    constructor(){
        this.router = Router();
        this.init();
    }

    getRouter(){
        return this.router;
    }

    init(){};

    param(path, ...callbacks){
        this.router.param(path, this.generateCustomResponses,this.applyCallbacks(callbacks));
    }

    get(path, policies,...callbacks){
        this.router.get(path, this.redirector, this.handlePolicies(policies), this.generateCustomResponses,this.applyCallbacks(callbacks));
    }

    post(path, policies, ...callbacks){
        this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses,this.applyCallbacks(callbacks));
    }
    
    put(path, policies, ...callbacks){
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses,this.applyCallbacks(callbacks));
    }

    patch(path, policies, ...callbacks){
        this.router.patch(path, this.handlePolicies(policies), this.generateCustomResponses,this.applyCallbacks(callbacks));
    }
    
    delete(path, policies, ...callbacks){
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses,this.applyCallbacks(callbacks));
    }

    applyCallbacks(callbacks){
        return callbacks.map(callback => async(...params) => {
            try{
                await callback.apply(this, params)
            } catch(error){
                console.log(error)
                params[1].status(500).send(error);
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.status(200).send({status: "success", payload})
        res.sendServerError = error => res.status(500).send({status: "error", error})
        res.sendUserError = payload => res.status(400).send({status: "error", payload})
        next();
    }

    redirector = (req, res, next) => {
        const authPaths = ["/restorePassword", "/restore", "/signup","/google", "/google/callback", "/github", "/github/callback"]

        if(authPaths.includes(req.path)){
            console.log(req.path)
            return next();
        }

        if(req.path !== "/login" && !req.cookies.jwt){
            console.log(req.path)
            return res.redirect("/login")
        }

        if(req.path === "/login" && req.cookies.jwt){
            console.log(req.path)
            return res.redirect("/products")
        }

        return next();

    }

    handlePolicies = (policies) => {

        if(policies[0] === "PUBLIC"){
            return (req, res, next) => {
                next();
            }
        }

        return async(req, res, next) => {
            passport.authenticate("jwt", function(err, user, info){
                if(err){
                    return next(err);
                }

                if(!user){
                    req.logger.error("Un usuario quiere ingresar sin autenticarse")
                    return res.status(401).send({error: info.messages ? info.messages : "Ocurrió un error en la validación"})
                }

                if(!policies.includes(user.role)){
                    req.logger.fatal("Un usuario quiere ingresar a zona restringida")
                    return res.status(403).send({error: "Forbidden: No tienes permiso para entrar."})
                }
                
                req.user = user;
                next();
            })(req, res, next);
        }
    }
}

module.exports = CustomRouter