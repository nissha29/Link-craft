import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        required: true,        
    },
    visitHistory: [
        { timestamp: {
            type: String,
        }}
    ]
}, {
    timestamps: true
})

const urlModel = mongoose.model('URL', urlSchema)
export default urlModel