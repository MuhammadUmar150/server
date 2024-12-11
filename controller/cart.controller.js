// import mongoose from "mongoose";
// import Product from "../model/product.model.js";

// export const getCartProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ _id: { $in: req.user.cartItems } });
//     const cartItems = products.map((product) => {
//       const item = req.user.cartItems.find(
//         (cartItem) => cartItem.id === product.id
//       );
//       return { ...product.toJSON(), quantity: item.quantity };
//     });
//     res.status(200).json(cartItems);
//   } catch (error) {
//     console.log("Error in getCartProduct", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// export const addToCart = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     console.log("Product ID:", productId);

//     const user = req.user;
//     console.log("User:", user);

//     // Find the product to add (assuming you need to get product details from the database)
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Check if the product already exists in the user's cart
//     const existingItem = user.cartItems.find(
//       (item) => item.productId === productId
//     );

//     if (existingItem) {
//       // Increment the quantity if the item exists in the cart
//       existingItem.quantity += 1;
//     } else {
//       // Add the product to the cart
//       user.cartItems.push({
//         productId: product._id,
//         quantity: 1,
//       });
//     }

//     // Save the user object
//     await user.save();
//     res.status(200).json(user.cartItems);
//   } catch (error) {
//     console.log("Error in adding to cart", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// export const removeAllFromCart = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const user = req.user;
//     if (!productId) {
//       user.cartItems = [];
//     } else {
//       user.cartItems = user.cartItems.filter((item) => item.id !== productId);
//     }
//     await user.save();
//     res.json(user.cartItems);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const updateQuantity = async (req, res) => {
//     try {
//         const { id: productId } = req.params;  // Get productId from URL params
//         const { quantity } = req.body;  // Get quantity from request body
//         const user = req.user;  // Get the user object (assuming the middleware adds it)

//         // Ensure productId is treated as an ObjectId if it's stored as an ObjectId in the cartItems
//         const objectId = new mongoose.Types.ObjectId(productId);  // Corrected line

//         // Log the incoming productId and user cartItems for debugging
//         console.log("productId:", productId);
//         console.log("user.cartItems:", user.cartItems);

//         // Find the item in the cart using _id comparison
//         const existingItem = user.cartItems.find((item) => item._id.toString() === objectId.toString());

//         if (existingItem) {
//             if (quantity === 0) {
//                 // Remove the product if quantity is 0
//                 user.cartItems = user.cartItems.filter((item) => item._id.toString() !== objectId.toString());
//                 await user.save();
//                 return res.json(user.cartItems);  // Return updated cart items
//             }

//             // Update the quantity if it's not 0
//             existingItem.quantity = quantity;
//             await user.save();
//             res.json(user.cartItems);  // Return updated cart items
//         } else {
//             res.status(404).json({ message: "Product not found" });  // If product is not in cart
//         }
//     } catch (error) {
//         console.log("Error in updateQuantity controller", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

import Product from "../model/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    // add quantity for each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // Find the product from your product database (assuming you have a Product model)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product already exists in the cart
    const existingItem = user.cartItems.find(
      (item) => item.id.toString() === productId
    );

    if (existingItem) {
      // If the product already exists, increment the quantity
      existingItem.quantity += 1;
    } else {
      // If the product doesn't exist, add it with quantity 1
      user.cartItems.push({ id: productId, quantity: 1, ...product._doc });
    }

    // Save the updated cart to the user document
    await user.save();

    // Return the updated cart items
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      return res.status(400).json({ message: "No product ID provided" });
    }

    // Find the product in the user's cart
    user.cartItems = user.cartItems.filter((item) => item.id !== productId);

    // Save the updated cart
    await user.save();

    // Send back the updated cart items after removal
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in removeFromCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }

      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in updateQuantity controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
