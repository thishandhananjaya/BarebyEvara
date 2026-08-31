import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export function  authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message: "Authorization Header Missing"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
       
        User.findById(decoded.userId)
            .then((user) => {
            if(!user){
                return res.status(401).json({message: "User not found"});

            }
            if(user.isBlocked){
                return res.status(403).json({message: "Access Denied"})
            }
            req.user = user;
            next();

        }).catch((err)=> {
            return res.status(500).json({message: "server not responding" });
        });
        
    }catch(err){
        return res.status(401).json({message:"Invalid or Expired Token"});
    }


} 