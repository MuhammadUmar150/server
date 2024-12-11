import express from 'express';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { addLikedProduct, getLikedProducts, removeLikedProduct } from '../controller/liked.controller.js';

const likedroutes = express.Router();

likedroutes.route('/').post(protectRoute, addLikedProduct)
likedroutes.route('/').get(protectRoute, getLikedProducts)
likedroutes.route('/').delete(protectRoute, removeLikedProduct)

export default likedroutes;