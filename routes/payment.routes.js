import express from 'express';
import { checkoutSuccess, createCheckoutSession } from '../controller/payment.controller.js';
import { protectRoute } from '../middlewares/authMiddleware.js';


const paymentroutes = express.Router();

paymentroutes.route('/checkout').post(protectRoute, createCheckoutSession)
paymentroutes.route('/success').post(protectRoute, checkoutSuccess)

export default paymentroutes;