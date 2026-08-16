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
            },"secret-123")

            return res.json({ message: "Login successful", token })
        }
    }})}