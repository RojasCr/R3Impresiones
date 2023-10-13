const mongoose = require("mongoose");
//const bcrypt = require("bcrypt")

const usersCollection = "users"

const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        default: null
    },
    googleId: {
        type: String,
        default: null
    },
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        default: null,
        require: true
    },
    age: {
        type: Number,
        require:true
    },
    password: {
        type: String,
        //unique:true
        require: true,
        default: ""
    },
    cart:{
        
        type: mongoose.Schema.Types.ObjectId,
        ref:"carts"
        
    },
    documents: {
        type: [
            {
                name: {
                    type: String
                },
                reference: {
                    type: String
                }
            }
        ]
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER", "PREMIUM"],
        default: "USER"
    },
    last_connection: {
        type: String
    }
});


/*userSchema.pre("save", async(next) => {
    try {
        const hashPass = bcrypt.hashSync(this.password, 10);
        this.password = hashPass;
        next();
        
    } catch (error) {
        throw error
    }
})*/

const userModel = mongoose.model(usersCollection, userSchema);

module.exports = userModel;