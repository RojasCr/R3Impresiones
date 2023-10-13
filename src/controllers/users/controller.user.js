const { Router } = require("express");
const passport = require("passport");
const UserManager = require("../../dao/mongoManager/MongoUserDao");
const cryptPassword = require("../../utils/cryptPassword");
//const MongoUserManager = require(process.cwd()+`/src/dao/mongoManager/MongoUserManager.js`);

const router = Router();
const userManager = new UserManager();

router.post("/", passport.authenticate("register", {failureRedirect: "/failRegister"}),async(req, res) => {
    try {
        //const { first_name, last_name, email, age, password } = req.body;
        // const newUser = {
        //     first_name,
        //     last_name,
        //     email,
        //     age,
        //     password: cryptPassword(password)
        // }
    
        // const response = await userManager.createUser(newUser);
        console.log("Registred")
        res.json({message: "Usuario registrado"});


    } catch (error) {
        //throw new Error(error)
         console.log(error)
        // res.json({error: err.errmsg})
        // if(error.code == 11000){
        //     res.status(400).send("El ususario ya existe")
        // }
        res.json({message: "El usuario ya existe"})
    }
});

router.get("/failRegister", async(req, res) => {
    console.log("Falló la estrategia");
    res.send({error: "Falló"});
})

//module.exports = router;