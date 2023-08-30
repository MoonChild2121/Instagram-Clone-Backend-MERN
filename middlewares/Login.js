const jwt = require("jsonwebtoken")
const Jwt = require('../keys.js') 
const mongoose = require('mongoose')
const USER = mongoose.model("USER")


module.exports = (req, res, next) => {
    //only logged in user can send req
    const {authorization} = req.headers;
    if(!authorization) {
        return res.status(401).json({error: "You arent logged in"})
    }
    const token = authorization.replace("bearer ", "")
    jwt.verify(token, Jwt,(err, payload) => {
        if(err) {
            return res.status(401).json({error: "You arent logged in"})
        }
        const {_id} = payload
        USER.findById(_id).then(userData => {
            req.user = userData
            next() 
        })
    })
    //to run next 
}