const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;
const requester = supertest("http://localhost:8080");
const jwt = "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNyaXN0aWFucm9qYXM3ODFAZ21haWwuY29tbm4iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2ODU4MDk0MTN9.qlRm0n8cKmc-j9U2u-5toXH2P14k7wt_eZ9LReHLkzo"

describe("Test e-commerce", () => {
    describe("Test products", () => {

        const path = "/api/products";
        
        it("Debería retornar status 200", async() => {
            const {statusCode} = await requester.get(path).set("Cookie", [jwt])

            expect(statusCode).to.equal(200);            
        })
        
        it("Debería retornar un objeto", async() => {
            const {_body} = await requester.get(path).set("Cookie", [jwt])

            expect(_body.payload.payload).is.a("Array")
        })
        
        it("Debería agregar un producto", async() => {
            const mockProduct= {
                //id: 1,
                title: "Producto",
                description: "Description",
                price: 1, 
                thumbail: "Thumbail",
                code: Math.floor(Math.random()*1000),
                stock: 1,
                category: "Category",
                owner: "abc@abc.com"
            }
            const {_body} = await requester.post(path).send(mockProduct).set("Cookie", [jwt])

            //console.log(_body)
            //expect(statusCode).to.equal(200);
            expect(_body.payload).is.a("String")
        })

        it("Debería retornar un producto", async() => {
            const mockParam = 1;
            const {_body} = await requester.get(`${path}/${mockParam}`).set("Cookie", [jwt])
            //console.log(_body.payload)
            expect(_body.payload).is.a("Object")
        })

    })

    describe("Test carts", () => {
        
        const path = "/api/carts"

        it("Debería agregar un carrito", async() => {

            const {_body} = await requester.post(path).set("Cookie", [jwt])
            //console.log(_body.payload)
            expect(_body.payload).is.a("String")
        })

        it("Debería retornar un carrito", async() => {
            const mockParam = 1;
            const {_body} = await requester.get(`${path}/${mockParam}`).set("Cookie", [jwt])
            //console.log(_body.payload)
            expect(_body.payload._id).is.ok
        })

        it("Debería borrar los productos de un carrito", async() => {
            const mockParam = 1;

            const {_body} = await requester.delete(`${path}/${mockParam}`).set("Cookie", [jwt])
            //console.log(_body)
            expect(_body.payload).is.a("String")
        })
    })

    describe("Test usuarios", () => {

        
        const userPath = "/api/users";
        const authPath = "/auth";
        const cookie = {};

        const mockUser = {
            first_name: "John",
            last_name: "Doe",
            email: "checho@example.com",
            age: 20,
            password: "123",
            //role: "admin"
        }

        it("Debe registrar un usuario", async () => {
            
            const {headers} = await requester.post(userPath).send(mockUser)
            console.log(headers)
            const authToken = headers["set-cookie"][0]
            expect(authToken).to.be.ok

        });

        it("Debería iniciar sesión y devolver un token", async () => {

            const {headers} = await requester.post(authPath).send({email: mockUser.email, password: mockUser.password})
            const authToken = headers["set-cookie"][0]
            expect(authToken).to.be.ok

            cookie.name = authToken.split("=")[0]
            cookie.value = authToken.split("=")[1]

            expect(cookie.name).to.equal("jwt")
            expect(cookie.value).to.be.ok
        })

    })
})