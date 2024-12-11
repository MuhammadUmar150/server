import express from 'express'

import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from '../controller/cart.controller.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const cartRoutes = express.Router();

cartRoutes.route('/').get(protectRoute, getCartProducts)
cartRoutes.route('/').post(protectRoute, addToCart)
cartRoutes.route('/').delete(protectRoute, removeAllFromCart)
cartRoutes.route('/:id').put(protectRoute, updateQuantity)

export default cartRoutes;