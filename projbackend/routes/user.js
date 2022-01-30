const express = require("express")
const router = express.Router()

const { getUserById, getUser, getAllUser} = require("../controllers/user")
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")

// middleware route... when a url with parameter :userid hit this route will be called automatically first then the "user/:userid" get request hit
// so it will also attatch to the req.profile
router.param("userid", getUserById)

router.get("/user/:userid", isSignedIn, isAuthenticated ,getUser)

// get all users
router.get("/users",  getAllUser)

module.exports = router