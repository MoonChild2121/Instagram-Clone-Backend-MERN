const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const USER = mongoose.model("USER")
const bcrypt = require('bcrypt')

router.get('/', (req, res)=> {
    res.send("Hello")
})

router.post('/signup', (req, res)=> {
    const {name, username, email, password} = req.body
    //to send message for insufficient input
    if(!name || !username || !email || !password) {
        return res.status(422).json({error: "please add all the fields"})
    }
    //if user exists already (same username and email)
    USER.findOne({$or : [{email:email}, {username:username}]}).then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error: "user on this email or username already exists"})
        }
        bcrypt.hash(password, 12).then((hashedPassword)=>{
            const user = new USER({
                name,
                username,
                email,
                password:hashedPassword
            })
            user.save()
            .then(user => {res.json({message: "account created"})})
            .catch(err => console.log(err))
        })
    })
})



module.exports = router