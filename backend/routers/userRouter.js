import express from "express";
import {addUser,loginUser,getUsers,getUserById,updateUser,deleteuser} from "../controllers/userController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {adminMiddleware} from "../middleware/adminMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register",addUser);
userRouter.post("/login",loginUser);
userRouter.get("/", authMiddleware,adminMiddleware,getUsers);
userRouter.get("/:id", authMiddleware,adminMiddleware,getUserById);
userRouter.put("/:id", authMiddleware,adminMiddleware,updateUser);
userRouter.delete("/:id",authMiddleware,adminMiddleware,deleteuser);
export default userRouter;