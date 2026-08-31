import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   firstName:{
    type:String,
    required:true
   },
   lastName:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   },
   password:{
      type:String,
      required:true
   },
   phone:{
    type:String,
    required:true,
    trim:true,
    match:/^(0\d{9}|\+94\d{9})$/
   },
   isBlocked:{
    type:Boolean,
    default:false
   },
   role:{
    type:String,
    enum:["user","admin"],
    default:"user"
   }
})

const User = mongoose.model("user",userSchema);

export default User;