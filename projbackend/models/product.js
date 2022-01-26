const mongoose = require("mongoose");
const { ObjectId }  = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        maxlength : 32
    },
    description : {
        type : String,
        required : true,
        trim : true,
    },
    price : {
        type : Number,
        required : true,
        trim : true
    },
    category : {
        type : ObjectId,     // one category has many product ( 1 category -> many products )
        ref : "Category",
        required : true
    },
    stock : {
        type : Number,

    },
    sold : {
        type : Number,
        default : 0
    },
    image : {
        data : buffer,
        contentType : String,
    }

}, {timestamps : true});

module.exports = mongoose.model("Product", productSchema);