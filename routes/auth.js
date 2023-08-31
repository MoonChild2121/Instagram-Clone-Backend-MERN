const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const USER = mongoose.model("USER")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const Jwt = require('../keys.js') // to make token
const login = require('../middlewares/Login')

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

router.post('/signin', (req,res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(422).json({error: "please add all the fields"})
    }
    USER.findOne({email:email})
    .then((matchingUser)=> {
        if(!matchingUser){
            return res.status(422).json({error: "invalid email"})
        }
        bcrypt.compare(password, matchingUser.password)
        .then((match)=> {
            if(match){
                // return res.status(200).json({message: "signed in successfully"})
                const token = jwt.sign({_id: matchingUser._id}, Jwt) 
                const {_id, name, email, username} = matchingUser
                res.json({token, user:{_id, name, email, username}})
            }
            else{
                return res.status(422).json({error: "invalid password"})
            }
        })
        .catch(err=> console.log(err))
    })
})



module.exports = router