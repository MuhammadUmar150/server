import mongoose from "mongoose";


export const connectDb = async()=>{
    try {
        let res = await mongoose.connect(process.env.MONGO_DB);
        console.log(`MongoDB connected successfully: ${res.connection.port}`);
    } catch (error) {
        console.log("db connection failed", error)
    }
}