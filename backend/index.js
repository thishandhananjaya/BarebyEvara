//import .env
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";

const app = express();



mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("database connected");
})
.catch(() => {
    console.log("failed to connect to database");
});

app.use(express.json());
app.use(bodyParser.json());
//middleware to decode token

//-----------------------------------------------------------------------User--------------------------------------------------------------

app.use("/users", userRouter);



//---------------------------------------------------------------------Products----------------------------------------------------------------
//product routes
app.use("/products", productRouter);






app.listen(5000, () => {
    console.log("server is running on port 5000");
});