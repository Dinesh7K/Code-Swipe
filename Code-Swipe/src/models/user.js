const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxlength: 30,
      validate(value) {
        if (!validator.isAlpha(value)) {
          throw new Error("Invaid First Name");
        }
      },
    },
    lastName: {
      type: String,
      required: true,
      minLength: 1,
      maxlength: 30,
      validate(value) {
        if (!validator.isAlpha(value)) {
          throw new Error("Invaid First Name");
        }
      },
    },
    username: {
      type: String,
      minLength: 1,
      maxlength: 30,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      immutable: true,
      minLength: 1,
      maxlength: 30,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Id");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not Strong enough");
        }
      },
    },
    dob: {
      type: Date,
      required: true,
      max: Date.now(),
      validate(value) {
        if (!(value instanceof Date) || isNaN(value)) {
          throw new Error("Date is not valid");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    image: {
      type: String,
    },
    about: {
      type: String,
      maxlength: 300,
      default: function () {
        return this.about===""? `Hello I am ${this.firstName} ${this.lastName}`:this.about
      },
    },
    skills: {
      type: [String],
      maxlength: 20,
      validate(value) {
        if (value.length > 10) {
          throw new Error("Skill Limit Exceeded");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.setHashPassword=async function(){
   this.password= await bcrypt.hash(this.password,15) 
}

userSchema.methods.validateHashPassword=async function(passwordInput){
  const isValid=await bcrypt.compare(passwordInput,this.password)
  return isValid
}

userSchema.methods.setJWT=function(){
   const jwtToken= jwt.sign({_id:this._id},"CODEswip#45")
   return jwtToken
}


const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
