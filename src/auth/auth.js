const { Router } = require("express");
const passport = require("passport");
const router = Router();
const UserManager = require("../dao/mongoManager/MongoUserManager");
const {compareCrypt} = require("../utils/cryptPassword")
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwt.utils");

const userManager = new UserManager();

router.post('/',  async(req, res) => {
    const {token,userInfo} = await generateToken(req, res)
    console.log(token);    
    return res.cookie("jwt", token).cookie("user", userInfo).redirect("/products");
});


//GOOGLE
router.get("/google", passport.authenticate("google", {scope: ["profile"]}))

router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login"}), (req, res) => {
    req.user.role = "USER";
    req.session.user = req.user;
    //console.log(req.user)
    res.cookie("jwt",jwt.sign({role: req.user.role}, "secreto")).cookie("user", req.user).redirect("/products")
})

//GITHUB
router.get("/github", passport.authenticate("github", {scope: ["user: email"]}));

router.get("/github/callback", passport.authenticate("github", {failureRedirect: "/login"}), (req, res) => {
    req.user.role = "USER";
    req.session.user = req.user;
    res.cookie("jwt",jwt.sign({role: req.user.role}, "secreto")).redirect("/products");
})

router.get("/logout", (req, res) => {
    //console.log(req.session)
    req.session.destroy(err => {
        if(err){
            res.json({msg: err})
        }
        //console.log(req.session)
        return res.clearCookie("jwt").redirect("/");
    })
    
});

router.patch("/restore", async (req, res) => {
    try {
        const { email, newPassword } = req.body;
    
        await userManager.updateUser(email, newPassword);
        return res.json({message: "Contraseña restaurada"});
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;