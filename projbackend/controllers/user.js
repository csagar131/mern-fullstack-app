const User = require("../models/user")
const Order = require("../models/order")

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
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    return res.json(req.profile)
}


// update the user

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
       { _id : req.profile._id},
       { $set : req.body },
       { new : true, useFindAndModify : false},
       (err, user) => {
           if(err){
               return res.status(400).json({
                   error : "No Updation made"
               })
           }
           user.salt = undefined
           user.encry_password = undefined
           res.json({
               user
           })
       }
    )
}


// read more about this one check for populate also
exports.userPurchaseList = (req, res) => {
    Order.find({ user : req.profile._id})
    .populate("user","_id name")   // check the populate
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error : "No order in this account"
            })
        }

        return res.json(order)
    })
}


// custome middleware to add purchases list to user

exports.putOrderInPurchaseList = (req, res, next) => {
    let purchases = []
    req.body.order.products.map( product => {
        purchases.push({
            _id : product._id,
            name : product.name,
            description : product.description,
            category : product.category,
            quantity : product.quantity,
            amount : req.body.order.amount,
            transaction_id : req.body.order.transaction_id
        })
    })

    // store the purchases in db
    User.findOneAndUpdate(
        { _id : req.profile._id},
        { $push : {purchases : purchases}},
        { new : true},   // send the updated object back
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error : " Unable to save purchases list"
                })
            }
        }
    )

    next()
}


// getAllUsers controller

// exports.getAllUser = (req, res) => {
//     User.find().exec((err, users) =>{
//         if(err || !users){
//             return res.status(401).json({
//                 error : "No user found"
//             })
//         }
//         return res.json({
//             users
//         })
//     })
// }

