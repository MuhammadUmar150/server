
import stripe from "../lib/stripe.js";
import Order from "../model/order.model.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // Stripe expects amount in cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `http://localhost:5173/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `http://localhost:5173/purchase-cancel`,
			metadata: {
				userId: req.user._id.toString(),
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};
  


// Custom order number generator function
// const generateOrderNumber = (userId) => {
// 	return `${userId}-${Date.now()}`;
//   };
  
export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: "Session ID is required." });
        }

        // Check if the order already exists
        const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
        if (existingOrder) {
            return res.status(200).json({
                success: true,
                message: "Order already exists.",
                orderId: existingOrder._id,
            });
        }

        // Retrieve the session details from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found." });
        }

        if (session.payment_status === "paid") {
            // Parse products from session metadata
            const products = JSON.parse(session.metadata.products);

            // Calculate the total price for the order
            const totalPrice = products.reduce(
                (acc, product) => acc + product.price * product.quantity,
                0
            );

            // Create and save the new Order document
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    product: product.id,
					name: product.name,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalPrice,
                stripeSessionId: sessionId,
            });

            await newOrder.save();

            res.status(200).json({
                success: true,
                message: "Payment successful, order created.",
                orderId: newOrder._id,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Payment not completed. Order not created.",
            });
        }
    } catch (error) {
        console.error("Error processing successful checkout:", error);
        res.status(500).json({
            success: false,
            message: "Error processing successful checkout",
            error: error.message,
        });
    }
};
  
  



