import express from "express";


const productRouter =express.Router();

productRouter.get('/',getProducts);
productRouter.get('/:id',getProductById);
productRouter.post('/',addProducts);
productRouter.delete('/:id',deleteProducts);
productRouter.put('/:id',updateProducts);

export default productRouter;