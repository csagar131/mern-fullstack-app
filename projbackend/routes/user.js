const express = require("express")
const router = express.Router()

const { getUserById, getUser, updateUser , userPurchaseList ,getAllUser} = require("../controllers/user")
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth")

// middleware route... when a url with parameter :userid hit this route will be called automatically first then the "user/:userid" get request hit
// so it will also attatch to the req.profile
router.param("userId", getUserById)

router.get("/user/:userId", isSignedIn, isAuthenticated ,getUser)

router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)

router.put("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)



// // get all users
// router.get("/users",  getAllUser)

module.exports = router