import express from "express";
import {
  addProduct,
  deleteProduct,
  featuredMen,
  featuredShoes,
  featuredSunglasses,
  featuredWomen,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductsbyCategory,
  getSaleProducts,
  updateProduct,
  updateStock,
} from "../controller/product.controller.js";

const productRoutes = express.Router();

productRoutes.route("/createproduct").post(addProduct);
productRoutes.route("/products").get(getAllProducts);
productRoutes.route("/products/category/:Category").get(getProductsbyCategory);
productRoutes.route("/products/:id").get(getProductById);
productRoutes.route("/products/featured").get(getFeaturedProducts);
productRoutes.route("/products/sale").get(getSaleProducts);
productRoutes.route("/products/men/featured").get(featuredMen);
productRoutes.route("/products/women/featured").get(featuredWomen);
productRoutes.route("/products/shoes/featured").get(featuredShoes);
productRoutes.route("/products/sunglasses/featured").get(featuredSunglasses);
productRoutes.route("/update-stock/:id").patch(updateStock);
productRoutes.route("/product/:id").patch(updateProduct);
productRoutes.route("/product/delete/:id").delete(deleteProduct);

export default productRoutes;
