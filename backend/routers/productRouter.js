import express from "express";
import { getProducts,getProductById,addProduct,deleteProduct,updateProduct } from "../controllers/productController.js";

const productRouter =express.Router();

productRouter.get('/',getProducts);
productRouter.get('/:id',getProductById);
productRouter.post('/',addProduct);
productRouter.delete('/:id',deleteProduct);
productRouter.put('/:id',updateProduct);

export default productRouter;