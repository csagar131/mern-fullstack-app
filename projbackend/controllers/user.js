const User = require("../models/user")


// middleware to attach user to req body as profile
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "No user Exist"
            })
        }

        req.profile = user
        next()
    })
}

// getuser controller to get user
exports.getUser = (req, res) => {
    //TODO: get back here for password
    return res.json(req.profile)
}

// getAllUsers controller

exports.getAllUser = (req, res) => {
    User.find().exec((err, users) =>{
        if(err || !users){
            return res.status(401).json({
                error : "No user found"
            })
        }
        return res.json({
            users
        })
    })
}