import express from "express";
import {addUser,loginUser} from "../controllers/userController.js";
import User from "../models/User.js";
const userRouter = express.Router();

userRouter.post("/",addUser);
userRouter.post("/login",loginUser);
export default userRouter;