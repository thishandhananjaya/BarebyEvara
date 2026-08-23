import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//---------------------------------------------------------User Registration--------------------------------------------------------------
export const addUser = (req,res) => {
  const passwordhash = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordhash,
        "phone":req.body.phone

    })
    user.save().then(()=>{
        res.json({ message: "user added successfully"});

    }).catch(()=>{
        res.json({ message: "failed to add user" });

    })}

//--------------------------------------------------------User Login------------------------------------------------------------------------
export function loginUser(req,res){
    const email = req.body.email
    const password = req.body.password

User.findOne({ email: email }).then((user) => {
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.isBlocked){
        return res.status(403).json({ message: "User is blocked" });
    }
    
    else {
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        else{
           
            const token = jwt.sign({
                email: user.email,
                firstname: user.firstName,
                lastname: user.lastName,
                role: user.role
            },process.env.JWT_SECRET,{expiresIn: "2h"})

            return res.json({ message: "Login successful", token })
         }
    }})}
//---------------------------------------------------------Admin Functions-------------------------------------------------------------------------------------------------
//GET USERS
    export const getUsers = (req,res) => {
        User.find({},"-password")
        .then((users) => {
            res.json(users);

        })
        .catch((err) => {
            res.status(500).json({ message: "failed to fetch users" });
        })
    };

 //Get Single User By ID
export const getUserById = (req,res) => {
    const id = req.params.id;
    User.findById(id,"-password")
    .then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    })
    .catch((err) => {
        res.status(500).json({ message: "failed to fetch user" });
    });
};

//Update User By ID
export const updateUser = (req,res) => {
    const id =req.params.id;
    const updateData ={
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        isBlocked: req.body.isBlocked
    };
   
    User.findOneAndUpdate({_id: id}, updateData, { new: true },"-password")
    .then((updatedUser) => {
         if (!updatedUser){
        return res.status(404).json({ message: "User not found" });
    }
        return res.status(200).json({message:"user updated successfully"});
        res.json(updatedUser);
    })
    .catch((err) => {
        res.status(500).json({ message: "failed to update user" });
    });
}

//delete User by id

export const deleteuser=(req,res)=>{
    const id = req.params.id;
    User.findByIdAndDelete(id).then((deletedUser)=>{
        if(!deletedUser){
            return res.status(404).json({message:"user not found"})
        }
        return res.status(200).json({message:"user deleted successfully"});
    }).catch((err)=> {
    return res.status(500).json({message:"failed to delete user"});
})}

