const express = require("express");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const router = express.Router();
const { body } = require('express-validator');

router.get("/signout", signout);

router.post("/signup",
            body('name').isLength({min : 3}),
            // username must be an email
            body('email').isEmail(),
            // password must be at least 5 chars long
            body('password').isLength({ min: 5 })
            , signup);

router.post("/signin",
            // username must be an email
            body('email').isEmail(),
            // password must be at least 5 chars long
            body('password').isLength({ min: 5 })
            , signin);


// test route

router.get("/testroute", isSignedIn, (req, res) => {

    // req.auth will contain the user id of the user from the token (middleware : userProperty : "auth")
    res.send("a protected route")
    console.log(req.auth)
})

module.exports = router;
