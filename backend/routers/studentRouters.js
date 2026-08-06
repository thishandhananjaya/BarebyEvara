import express from "express";
import { getStudents,addStudent } from "../controllers/studentController.js";
const studentRouter = express.Router();
//get request router to student
studentRouter.get("/",getStudents);
//post request router to student
studentRouter.post("/",addStudent);
    

export default studentRouter;

