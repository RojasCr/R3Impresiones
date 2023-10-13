const mongoose = require("mongoose");
const UsersDao = require("../src/dao/mongoManager/MongoUserDao");
const Assert = require("assert")

mongoose.connect("mongodb+srv://coderBackend:descartes1@cluster0.9dxtyf1.mongodb.net/test?retryWrites=true&w=majority");

const assert = Assert.strict

describe("Testear DAO de usuarios", () => {
    beforeEach(() => {
        this.Users = new UsersDao()
    })


    it("Debe devolver un array", async() => {
        const result = await this.Users.findAll();

        console.log(result)
        assert.strictEqual(Array.isArray(result), true)
    })
})