import cloudinary from "../lib/cloudinary.js";
import Product from "../model/product.model.js";

import Categories from "./categories.js";

//for adding product
export const addProduct = async (req, res) => {
  const {
    name,
    description,
    image,
    price,
    category,
    brand,
    stock,
    isFeatured,
    onSale,
  } = req.body;
  let cloudinaryResponse = null;

  try {
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    // Validate input fields
    if (!Categories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    if (!name || !description || !price || !category || !brand) {
      return res
        .status(400)
        .json({ message: "All required fields are missing" });
    }

    // Save product in the database
    const product = await Product.create({
      name,
      description,
      image: cloudinaryResponse?.secure_url || image, // Use cloudinary's image URL if available
      price,
      category,
      brand,
      stock,
      isFeatured,
      onSale,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error while creating product:", error); // Log the full error to console
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

//get product by id

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({ message: "Invalid product id" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching product",
      error,
    });
  }
};

//to get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching products",
      error,
    });
  }
};

//to get product by category
// Modify the getProductsbyCategory to support dynamic query parameters for featured and onSale
// Controller to get products by category without query parameters
export const getProductsbyCategory = async (req, res) => {
  const { Category } = req.params;

  try {
    const products = await Product.find({ category: Category });
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      message: "Error while fetching products by category",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const {
    name,
    description,
    image,
    price,
    category,
    brand,
    stock,
    isFeatured,
    onSale,
  } = req.body;

  let cloudinaryResponse = null;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (image) {
      if (image.startsWith("data:image")) {
        // If it's base64 encoded, upload to Cloudinary
        cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
      } else if (image.startsWith("http") || image.startsWith("https")) {
        // If it's a valid URL, use it directly
        cloudinaryResponse = { secure_url: image };
      }
    }

    // Category validation
    if (category && !Categories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Update the product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.image = cloudinaryResponse?.secure_url || product.image;
    product.price = price || product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.stock = stock || product.stock;

    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured;
    }
    if (onSale !== undefined) {
      product.onSale = onSale;
    }

    // Save the updated product
    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error while updating product:", error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    // Find and delete the product
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If the product has an image, delete it from Cloudinary
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId); // Deletes the image from Cloudinary
    }

    // Send a success response after deletion
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error while deleting product:", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// export const getProductsbyCategory = async(req, res)=>{
//   const category = req.params.Category;
//   try {
//     const products = await Product.find({category});
//     if (!products.length) {
//       return res.status(404).json({ message: 'No products found for this category' });
//     }
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error while fetching products by category",
//       error,
//     });
//   }
// }

//to get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true });
    if (!products.length) {
      return res.status(404).json({ message: "No featured products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching featured products",
      error,
    });
  }
};

//to get sale products
export const getSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ onSale: true });
    if (!products.length) {
      return res.status(404).json({ message: "No sale products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching sale products",
      error,
    });
  }
};

//featuredMen
export const featuredMen = async (req, res) => {
  try {
    const products = await Product.find({ category: "Men", isFeatured: true });
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No featured men products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching featured men products",
      error,
    });
  }
};

//featured women

export const featuredWomen = async (req, res) => {
  try {
    const products = await Product.find({
      category: "Women",
      isFeatured: true,
    });
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No featured women products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching featured women products",
    });
  }
};
//featured Shoes

export const featuredShoes = async (req, res) => {
  try {
    const products = await Product.find({
      category: "Shoes",
      isFeatured: true,
    });
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No featured shoes products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching featured shoes products",
      error,
    });
  }
};

//featuredSunglasses

export const featuredSunglasses = async (req, res) => {
  try {
    const products = await Product.find({
      category: "Sunglasses",
      isFeatured: true,
    });
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No featured sunglasses products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching featured sunglasses products",
      error,
    });
  }
};

export const updateStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the quantity is a valid number and greater than 0
    if (!quantity || quantity <= 0 || isNaN(quantity)) {
      return res.status(400).json({ message: "Invalid stock quantity" });
    }

    // Check if the quantity requested is more than available stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    console.log(product.stock);

    product.stock -= quantity;
    await product.save();

    res.status(200).json({ message: "Stock updated successfully", product });
  } catch (error) {
    console.error("Error updating stock:", error);
    res
      .status(500)
      .json({ message: "Error updating stock", error: error.message });
  }
};
