import express from "express";
import { getProfile, login, logout, refreshToken, signup } from "../controller/usercontroller.js";
import { protectRoute } from "../middlewares/authMiddleware.js";




const userRoutes = express.Router();

userRoutes.route("/register").post(signup);
userRoutes.route("/login").post(login);
// userRoutes.route("/getall").get(getUsers);
// userRoutes.route("/getuser/:id").get(getUserById);
// userRoutes.route("/delete/:id").delete(deleteUser);
userRoutes.post("/refresh-token",protectRoute, refreshToken);
userRoutes.get("/profile",protectRoute, getProfile);
userRoutes.post("/logout",protectRoute, logout);


export default userRoutes;
