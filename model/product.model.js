import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  category: {type: String, required: true},
  brand: { type: String, required: true},
  stock: {type: Number, required: true},
  isFeatured: { type: Boolean, default: false},
  onSale: {type: Boolean, default: false}
},{
    timestamps: true
}
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
