const customRouter = require("../../routers/CustomRouter");
const jwt = require("jsonwebtoken")
const passport = require("passport");
const fs = require("fs");


const Users = require("../../repositories/index");
//const userModel = require("../../dao/mongo/models/users.model");
const uploader = require("../../utils/multer.utils");
const UserDTO = require("../../DTOs/User.dto");
const SendMail = require("../../utils/nodeMailer/nodeMailer");

const userDto = new UserDTO();


class UsersRouter extends customRouter{
    init(){
        this.post("/", ["PUBLIC"], passport.authenticate("register", {failureRedirect: "/api/users/failRegister"}),async(req, res) => {
            try {

                const { user } = req;
                req.logger.info("Nuevo usuario registrado")

                const newUser = await Users.findUser(user.email)
                const currentUser = await userDto.findOne(newUser)
                currentUser.totalProducts = 0;
                console.log(currentUser)
                SendMail.newUser(user)
                
                res.cookie("jwt", jwt.sign({role: user.role}, "secreto")).cookie("user", currentUser).redirect("/products");
            } catch (error) {
                console.log(error)
                res.sendServerError("El usuario ya existe")
            }
        });
        
        this.get("/failRegister", ["PUBLIC"],async(req, res) => {
            //req.logger.error("Usuario ya existente")
            //console.log("Falló la estrategia");
            res.sendUserError("Usuario ya existente");
        });

        this.patch("/premium", ["USER", "ADMIN", "PREMIUM"], async(req, res) => {
            try {

                const {email} = req.body

                const user = await Users.findUser(email)

                const currentUser = user ? user : req.user;
                const currentRole = currentUser.role;

                if(currentUser === req.user && currentRole === "USER"){

                    const path = `${process.cwd()}/src/files/documents/${currentUser.email}`
                    
                    if(!fs.existsSync(path)){
                        return res.sendUserError("No has completado la documentación")
                    }
                }
                
                const rolesChanger = {
                    USER: "PREMIUM",
                    PREMIUM: "USER"
                }

                const newRole = rolesChanger[currentRole];
                            
                await Users.updateGrade(currentUser.email, newRole);

                if(currentUser === user){
                    return res.sendSuccess(`El role de ${email} fue cambiado a ${newRole} correctamente`);
                }
                const newJwt = jwt.sign({email: currentUser.email, role: newRole}, "secreto");
                return res.cookie("jwt", newJwt).sendSuccess(`Ahora eres ${newRole}`);
            
            } catch (error) {
                req.logger.error(error)
                res.sendServerError(error)
            }
        })

        this.get("/user", ["PUBLIC"], async(req, res) => {
            try {
                const {email}= req.query;
                const user = await Users.findUser(email);
                res.sendSuccess(user);
            } catch (error) {
                throw new Error(error);
            }
        })
        
        this.get("/", ["ADMIN"], async (req, res) => {
            try {
                
                const users = await Users.findAll();

                const usersInfo = await userDto.find(users);
                res.sendSuccess(usersInfo);
            } catch (error) {
                throw error
            }
        })

        this.post("/documents", ["USER","ADMIN", "PREMIUM"], uploader.any(),async (req, res) => {
            try {
                const currentUser = req.user;

                if(currentUser.role === "PREMIUM"){
                    return res.sendSuccess("Ya eres Premium")
                }
                const files = req.files;
               
                res.sendSuccess(`Tus archivos ${files[0].filename}, ${files[1].filename} y ${files[2].filename} se cargaron correctamente`)
            } catch (error) {
                //console.log(error)
                throw new Error(error)
            }
        })

        this.delete("/", ["ADMIN"], async (req, res) => {
            try {
                const users = await Users.findAll();

                const filterDate = new Date();
                filterDate.setMinutes(filterDate.getMinutes() - 1)
                
                const usersToDelete = users.filter(user => new Date(user.last_connection) < filterDate)

                if(usersToDelete.length !== 0){
                    usersToDelete.forEach( async (user) => {
                        await Users.delete(user.email)
                        SendMail.inactiveUser(user.email)
                    })
                    return res.sendSuccess("Los usuarios inactivos fueron borrados")
                }
                
                return res.sendSuccess("No hay usuarios inactivos")
            } catch (error) {
                throw new Error(error);
            }
        })

        this.delete("/deleteOne", ["ADMIN"], async (req, res) => {
            try {
                const { email } = req.body

                await Users.delete(email)

                res.sendSuccess(`El usuario ${email} fue eliminado con éxito`)
            } catch (error) {
                throw new Error(error)
            }
        })
    }
}

module.exports = UsersRouter;