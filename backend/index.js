import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";

import jwt from "jsonwebtoken";
const app = express();

const connectionstring = "mongodb+srv://pinkgrapes20021128_db_user:PtWP69nRGK8jOZ5z@cluster0.mfhoa9o.mongodb.net/clothingwebsite?appName=Cluster0";

mongoose.connect(connectionstring)
.then(() => {
    console.log("database connected");
})
.catch(() => {
    console.log("failed to connect to database");
});

app.use(express.json());
app.use(bodyParser.json());
//middleware to decode token
app.use((req, res, next) => {
    const value = req.header("Authorization");

    if (value != null) {
        const token = value.replace("Bearer ", "");

        jwt.verify(token, "secret-123", (err, decode) => {

            if (err || decode == null) {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }

            req.user = decode;
            next();
        });

    } else {
        next();
    }
});
//-----------------------------------------------------------------------User--------------------------------------------------------------
//user post route
app.use("/users", userRouter);
//user login
app.use("/users", userRouter);


//---------------------------------------------------------------------Products----------------------------------------------------------------
//product routes
app.use("/products", productRouter);








app.listen(5000, () => {
    console.log("server is running on port 5000");
});