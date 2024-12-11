import Liked from "../model/liked.model.js";
import Product from "../model/product.model.js";


export const addLikedProduct = async(req, res)=>{
    const {productId} = req.body;
    try {
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({message: "Product not found"})
        }
        const existingLikedProduct = await Liked.findOne({
            user: req.user._id,
            product: productId
        })
        if(existingLikedProduct){
            return res.status(400).json({message: "Product already liked"})
        }
        const newLikedProduct = new Liked({
            user: req.user._id,
            product: productId
        })
        await newLikedProduct.save();
        res.status(201).json({message: "Product Liked", newLikedProduct})
    } catch (error) {
        console.log("Error in addLikedProduct controller", error.message);
        res.status(500).json({message: "Server error", error: error.message})
    }
}

export const removeLikedProduct = async(req, res)=>{
    const {productId} = req.body;
    try {
        const existingLikedProduct = await Liked.findOneAndDelete({
            user: req.user._id,
            product: productId
        })
        if(!existingLikedProduct){
            return res.status(404).json({message: "Product not found"})
        }
        res.json({message: "Product unliked", existingLikedProduct})
    } catch (error) {
        console.log("Error in removeLikedProduct controller", error.message);
        res.status(500).json({message: "Server error", error: error.message})
    }
}

export const getLikedProducts = async(req, res)=>{
    try {
        const likedProducts = await Liked.find({user: req.user._id})
        .populate("product", ["name", "price", "image"])
        res.json({likedProducts})
    } catch (error) {
        console.log("Error in getLikedProducts controller", error.message);
        res.status(500).json({message: "Server error", error: error.message})
    }
}