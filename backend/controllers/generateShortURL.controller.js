import { nanoid } from "nanoid";
import urlModel from "../models/url.model.js";

export default async function generateShortURL(req,res) {
    try{
        const { originalUrl } = req.body
        if(! originalUrl){
            return res.status(400).json({
                success: false,
                message: `URL is required`
            })
        }

        const shortId = nanoid(process.env.LENGTH)
        await urlModel.create({
            shortId,
            redirectURL: originalUrl,
            visitHistory: [],
        })

        return res.status(200).json({
            success: true,
            shortId,
            message: `Short URL created successfully`
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: `Server error in generate short URL EP`
        })
    }
}