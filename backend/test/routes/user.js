process.env.NODE_ENV = 'test'
const chai = require('chai');
const should = chai.should();
const chaiHTTP = require('chai-http');
const server = require('../../index');
const { removeUserByUsername } = require('../../db/models/users')
require('../_setup')

chai.use(chaiHTTP);

describe('#routesUser', () => {
    context("Testing POST /user/register", () => {
        let data = {
            username: "TestUser1",
            password: "Aasjkhvasf5"
        }
        after("Remove registered user", () => {
            return removeUserByUsername(data.username)
        })
        it("Should add a new user", () => {
            chai.request(server)
                .post('/user/register')
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                })
        })
    })
})