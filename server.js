import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./lib/mongodb.js";
import userRoutes from "./routes/userroutes.js";
import cors from "cors"
import productRoutes from "./routes/productroutes.js";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cartroutes.js";
import paymentroutes from "./routes/payment.routes.js";
import likedroutes from "./routes/liked.routes.js";

dotenv.config();

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); // Increase the limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const PORT = process.env.PORT || 5000 ;
//routes
app.use(express.json());
app.use("/api", userRoutes)
app.use("/api", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/payment", paymentroutes)
app.use("/api/liked", likedroutes)


app.listen(PORT, ()=>{
    console.log("Server is running on http://localhost:" + PORT);
    connectDb();
})