const CustomRouter = require("../routers/CustomRouter");

const jwt = require("jsonwebtoken")
const { generateToken } = require("../utils/jwt.utils");
const passport = require("passport");

const { compareCrypt } = require("../utils/cryptPassword");
const SendMail = require("../utils/nodeMailer/nodeMailer");
const Users = require("../repositories");



//const userManager = new UserManager();

class AuthRouter extends CustomRouter{
    init(){
    
        this.post("/", ["PUBLIC"], async(req, res) => {
            try {
                const { email, password } = req.body;

                const response = await generateToken(email, password)
                   
                res.cookie("jwt", response.token, {httpOnly: true, secure: true}).cookie("user", response.userInfo, {httpOnly: true, secure: true}).redirect("/products");
            } catch (error) {
                req.logger.error("Usuario no autenticado");
                res.sendUserError("Tu usuario y/o constraseña no coinciden")
            }
        })

        //GOOGLE
        this.get("/google", ["PUBLIC"], passport.authenticate("google", {scope: ["profile", "email"]}))

        this.get("/google/callback", ["PUBLIC"], passport.authenticate("google", {failureRedirect: "/login"}), async(req, res) => {
            const response = await generateToken(req.user.email)
            res.cookie("jwt",response.token, {httpOnly: true, secure: true}).cookie("user", response.userInfo, {httpOnly: true, secure: true}).redirect("/products")
        })
        
        //GITHUB
        this.get("/github", ["PUBLIC"], passport.authenticate("github", {scope: ["user: email"]}));
        
        this.get("/github/callback", ["PUBLIC"],passport.authenticate("github", {failureRedirect: "/login"}), async(req, res) => {
            //req.user.role = "USER";
            //req.session.user = req.user;
            const response = await generateToken(req.user.email)
            res.cookie("jwt",response.token, {httpOnly: true, secure: true}).cookie("user", response.userInfo, {httpOnly: true, secure: true}).redirect("/products");
        })

        this.get("/logout", ["USER", "PREMIUM", "ADMIN"], async (req, res) => {
            
            const { email } = req.user
            await Users.refreshConnection(email);
            
            req.session.destroy(err => {
                if(err){
                    res.json({msg: err})
                }
                
                //console.log(req.session)
                return res.clearCookie("jwt").clearCookie("user").redirect("/");
            })
    
        });

        this.post("/sendMail", ["PUBLIC"], async(req, res) => {
            const { email } = req.body

            const user = await Users.findUser(email);

            if(!user){
                return res.sendUserError("Este email no está registrado")
            }

            SendMail.restorePass(email);
            
            res.sendSuccess("Mail enviado");
        })

        this.patch("/restore", ["PUBLIC"], async (req, res) => {
            try {
                const { email, newPassword } = req.body;

                //const user = await Users.findUser(email);

                //const isRepeated = compareCrypt(newPassword, user.password);

                /*if(isRepeated){
                    return res.json({status: "error", message: "El password no puede ser el mismo"})
                }*/

                await Users.updateUser(email, newPassword);
                return res.sendSuccess("Contraseña restaurada");
            } catch (error) {
                console.log(error);
            }
        })
    }
}

module.exports = AuthRouter;