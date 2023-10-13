const { cryptPassword } = require("../../utils/cryptPassword");



class UserMemoryDao{
    constructor(){
        this.data = []
    }

    createUser = async (newUser) => {
        try {
            this.data.push(newUser);
            return newUser;
        } catch (error) {
            throw error
        }
    }

    findAll = () => {
        try {
            return this.data;
        } catch (error) {
            throw error
        }
    }

    findUser = (email) => {
        try {
            const user = this.data.find( u => u.email === email);
            return user;
        } catch (error) {
            throw error
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
    
    updateUser = async (email, newPassword) => {
        try {
            const user = this.data.find( u => u.email === email);
            user.password = cryptPassword(newPassword);
        } catch (error) {
            throw error
        }
    }
}

module.exports = UserMemoryDao;