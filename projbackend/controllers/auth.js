const User = require("../models/user")
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expJwt = require('express-jwt');

exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message : "Signout successfull"
    })
}

exports.signup = (req, res) => {

    const user = new User(req.body); // coming from User Model

    const errors = validationResult(req);
    // check for input validations
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg });
    }

    user.save((err, user) => {
        // checks for required fields in the db
        if(err){
            return res.status(400).json({
                err : "No User Created"
            })
        }
        res.json({
            name : user.name,
            email : user.email,
            id : user._id,
            purchases : user.purchases
        })
    });
}


exports.signin = (req, res) => {
    const { email, password} = req.body;

    const errors = validationResult(req);
    // check for input validations
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()[0].msg });
    }

    // give exactly one record from the database and give err and user object
    User.findOne({ email }, (err, user) => {
        if(err || !user ){
            return res.status(400).json({ 
                error : "User doesn't exist"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error : "Incorrect Email and Password"
            })
        }

        // sign the token with id as payload and secret
        const token = jwt.sign({_id : user._id}, process.env.SECRET)

        // put token inside cookie
        res.cookie(
            "token", token,
            {
                expire : new Date() + 99
            }
        )

        // send res to frontend
        const { _id, name, email, role } = user
        return res.json({ token , user : {
            _id, name, email, role
        }})
    })
}


// protected routes

// express middleware to validate jwt token from client to protect the routes
exports.isSignedIn = expJwt({
    secret : process.env.SECRET,
    userProperty : "auth",     //userProperty is the property where the JWT payloads will be attached to each request, so we can access the data using req.payload
})



// custome middleware
exports.isAuthenticated = (req, res, next) => {
    console.log("req.profile : ", req.profile)
    console.log("req.auth : ", req.auth)

    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    console.log("checker is : ",checker)
    if(!checker) {
        return res.json({
            message : "ACCESS DENIED"
        })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.json({
            message : "Invalid Admin Access"
        })
    }
    next()
}