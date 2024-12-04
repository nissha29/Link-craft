import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
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
            type: Date,
        }}
    ]
}, {
    timestamps: true
})

const urlModel = mongoose.model('URL', urlSchema)
export default urlModel