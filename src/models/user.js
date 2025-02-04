const mongoose = require("mongoose");
const validator=require("validator")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 15,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable:true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Email id is not valid")
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error("enter a strong password")
        }
      }
    },
    age: {
      type: Number,
      min: 18,
      default: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },
    photourl: {
      type: String,
      default:
        "https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg",
      trim: true,
      validate(value){
        if(!validator.isURL(value)){
          throw new Error("photo url id not valid")
        }
      }
    },
    about: {
      type: String,
      maxLength: 500,
      trim: true,
    },
    skills: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 10;
        },
        message: "You can only add up to 10 skills",
      },
    },
  },
  { timestamps: true }
);
userSchema.methods.getJWT=async function(){
  const user=this;
  const token=await jwt.sign({_id:user._id},"Vashee@Bhai")
  return token;
}
userSchema.methods.validatePassword=async function(passwordInputByUser){
  const user=this;
  const isPasswordValid=await bcrypt.compare(passwordInputByUser,user.password)
  return isPasswordValid;

}

const User = mongoose.model("User", userSchema);
module.exports = User;
