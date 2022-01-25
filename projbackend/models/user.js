import { v4 as uuidv4 } from "uuid";

const mongoose = require("mongoose");
const { createHmac } = await import("crypto");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 32,
    trim: true,
  },
  lastname: {
    type: String,
    maxlength: 32,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  userinfo: {
    type: String,
    trim: true,
  },

  encry_password: {
    type: String,
    required: true,
  },

  salt: String,

  // different roles of use
  role: {
    type: Number,
    default: 0,
  },

  purchases: {
    type: Array,
    default: [],
  },
});

// defining virtuals : virtuals dont get stored inside db but it can be accessed at model level
userSchema.virtuals("password").set(function(password){
        this._password = password;     // storing plain password into private variable
        this.salt = uuidv4();    // setting the salt before calling securepassword
        this.encry_password = this.securePassword(password);   //calling securePassword method from custom method
}).get(function(){
    return this._password;   // this refers to userSchema object (return the password in plaintext format)
});


// defining custome method to userSchema
userSchema.method = {
  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      // return hashed password using salt
      return createHmac("sha256", this.salt) // here this refers to userSchema object
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  authenticate : function(plainpassword){
    return this.securePassword(plainpassword) === this.encry_password ;
  }
};

module.exports = mongoose.model("User", userSchema);
