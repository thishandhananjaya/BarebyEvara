import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export async function  authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Authorization Header Missing"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
       
        const user = await User.findById(decoded.userId).select("-password");
            
            if(!user){
                return res.status(401).json({message: "User not found"});

            }
            if(user.isBlocked){
                return res.status(403).json({message: "Access Denied"})
            }
            req.user = user;
            next();

        }catch(err) {
            console.error(err);
            return res.status(401).json({message: "Invalid or Expired Token" });
            
        };
        
    }

