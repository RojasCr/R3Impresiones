
const { cryptPassword } = require("../../utils/cryptPassword");
const userModel = require("../mongo/models/users.model");

class UserMongoDao{
    //new
    constructor(){}
    //

    createUser = async (newUser) => {
        try {
            const user = await userModel.create(newUser);
            return user;
        } catch (error) {
            throw new Error(error)
        }
    }

    findAll = async() => {
        try {
            const response = await userModel.find();
            return response;
        } catch (error) {
            throw error
        }
    }
    
    findUser = async(email) => {
        try {
            const response = await userModel.findOne({email}).populate("cart")
            return response;
        } catch (error) {
            console.log(error)
        }
    }

    findById = async(id) => {
        try {
            const result = await userModel.findById(id);
            return result;            
        } catch (error) {
            console.log(error)
        }
    }

    updateUser = async(email, newPassword) => {
        try {
            await userModel.updateOne({email}, {password: cryptPassword(newPassword)})
        } catch (error) {
            console.log(error);
        }
    }

    updateGrade = async(email, newGrade) => {
        try {
            const response = await userModel.updateOne({email}, {role: newGrade})
            //console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    refreshConnection = async (email) => {
        try {
            const response = await userModel.updateOne({email}, {last_connection: new Date()})
        } catch (error) {
            console.log(error);
        }
    }

    delete = async (email) => {
        try {
            const response = await userModel.deleteOne({email})
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = UserMongoDao;