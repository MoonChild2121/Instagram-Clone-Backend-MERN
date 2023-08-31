const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const POST = mongoose.model("POST")
const login = require('../middlewares/Login')

router.post('/createPost', login, (req, res) => {
    const {body, pic} = req.body;
    if(!body || !pic){
        //if the title or error is missing
        return res.status(422).json({error: "please add all the fields"})
    }
    console.log(req.user)
    const post = new POST({
        body,
        photo:pic, //the reactapp is sendng data as "pic" 
        postedBy: req.user
    })
    post.save()
    .then((result) => {
        setpostpic(result);
        console.log(postpic);
    })
    .catch(err => console.log(err))
})

router.get('/posts',login, (req, res)=> {
    POST.find()
    .populate("postedBy","_id name")
    .then(posts => res.json(posts))
    .catch(err => console.log(err))
})

router.get('/myposts',login, (req, res) => {
    POST.find({postedBy: req.user._id})
    .then(myposts => {
        res.json(myposts)
    })
})

router.put("/like",login, (req,res)=> {
    POST.findByIdAndUpdate(req.body.postId, {
        $push:{likes : req.user._id}
    }, {
        new:true
    }).then((result) => {
        return res.json(result);
    })
    .catch(err => {
        return res.status(422).json({error: err});
    })
})

router.put("/dislike", login, (req, res) => {
    POST.findByIdAndUpdate(
        req.body.postId,
        {
            $pull: { likes: req.user._id }
        },
        {
            new: true
        }
    )
    .then(result => {
        return res.json(result);
    })
    .catch(err => {
        return res.status(422).json({ error: err });
    });
});

module.exports =router;