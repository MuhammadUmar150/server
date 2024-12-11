import mongoose from "mongoose";

const likedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
},{
    timestamps: true
})

const Liked = mongoose.model("Favorite", likedSchema)
export default Liked