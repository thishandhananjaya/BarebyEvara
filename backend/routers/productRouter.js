import express from "express";
import { getProducts,getProductById,addProduct,deleteProduct,updateProduct } from "../controllers/productController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {adminMiddleware} from "../middleware/adminMiddleware.js";

const productRouter =express.Router();

productRouter.get('/getproducts',getProducts);
productRouter.get('/getproducts/:id',getProductById);
productRouter.post('/addproduct/',authMiddleware,adminMiddleware,addProduct);
productRouter.delete('/deleteproduct/:id',authMiddleware,adminMiddleware,deleteProduct);
productRouter.put('/updateproduct/:id',authMiddleware,adminMiddleware,updateProduct);

export default productRouter;