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
    unique:true
   },
   password:{
      type:String,
      required:true
   },
   phone:{
    type:String,
    default:"0712345678 OR +94712345678"
   },
   isBlocked:{
    type:Boolean,
    default:false
   },
   role:{
    type:String,
    default:"user"
   }
})

const User = mongoose.model("user",userSchema);

export default User;