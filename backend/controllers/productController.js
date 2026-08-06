import Product from "../models/product.js";

export const getProducts = (req,res) => {
    Product.find()
        .then((products) => {
            res.json(products);})
        .catch((err) => {
            res.status(500).json({ message: "failed to fetch products" });
        });}


export const addProduct = (req,res) => {
    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        stock: req.body.stock,
        images: req.body.images
    });
    product.save()
        .then((savedProduct) => {
            res.status(201).json(savedProduct);
        })
        .catch((err) => {
            res.status(500).json({ message: "failed to add product" });
        }); 
}

export const getProductById = (req,res) => {
    const id = req.params.id;
    Product.findById(id)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json(product);
        })
        .catch((err) => {
            res.status(500).json({ message: "failed to fetch product" });
        });
}

export const updateProduct = (req,res) => {
    const id = req.params.id;
    Product.findOneAndUpdate({_id: id}, req.body, { new: true })
    .then((updatedProduct) => {
        res.json(updatedProduct);
    })
    .catch((err) => {
        res.status(500).json({ message: "failed to update product" });
    });
}

export const deleteProduct = (req,res) => {
    const id = req.params.id;
    Product.findByIdAndDelete(id)
     .then((deletedProduct) => {
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully", product: deletedProduct });
    })

    .catch((err) => {
        res.status(500).json({ message: "failed to delete product"});
    }); };