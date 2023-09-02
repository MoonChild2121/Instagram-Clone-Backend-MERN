const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const POST = mongoose.model("POST")
const USER = mongoose.model("USER")
const login = require('../middlewares/Login')

//other users profile
router.get("/user/:id", (req,res)=> {
    USER.findOne({_id: req.params.id})
    .select("-password")
    .then(user => {
        POST.find({postedBy: req.params.id})
        .populate("postedBy", "_id")
        .then(post => {
            return res.status(200).json({user, post})
        })
        .catch(err => {
            return res.status(422).json({error: err})
        })
    })
})

//to follow
router.put("/follow", login, async (req, res) => {
    try {
        const updatedUser = await USER.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id }
        }, {
            new: true
        });

        await USER.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        });

        res.json(updatedUser);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});

//unfollow
router.put("/unfollow", login, async (req, res) => {
    try {
        const updatedUser = await USER.findByIdAndUpdate(req.body.followId, {
            $pull: { followers: req.user._id }
        }, {
            new: true
        });

        await USER.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followId }
        });

        res.json(updatedUser);
    } catch (err) {
        res.status(422).json({ error: err });
    }
});


module.exports = router