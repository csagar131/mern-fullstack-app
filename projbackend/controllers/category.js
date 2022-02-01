const Category = require("../models/category")


// custom middleware
exports.getCategoryById = (req, res, next, id) => {

    // fetching from db
    Category.findById(id).exec((err, category) => {
        if(err){
            return res.status(400).json({
                error : "No Category Found"
            })
        }
        req.category = category
    })
    next()
}

// controller
exports.createCategory = (req, res) => {
    const category = new Category(req.body)
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error : "Not able to save the category"
            })
        }

        return res.json({category})
    })
}

exports.getCategory = (req, res) => {
    return res.json(
        req.category
    )
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err){
            return res.status(400).json({
                error : "No category found"
            })
        }

        return res.json(categories)
    })
}