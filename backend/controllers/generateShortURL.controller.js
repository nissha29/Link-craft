import { nanoid } from "nanoid";
import urlModel from "../models/url.model.js";
import generateUserId from "../utils/generateUserId.utils.js";

export default async function generateShortURL(req,res) {
    try{

        let userId = req.cookies.userId || ""

        if(! userId){
            userId = generateUserId()

            let cookieOptions = {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'none',
                httpOnly: true,
                secure: true,
                path: '/',
            };

            if (process.env.NODE_ENV === 'production') {
                cookieOptions.domain = 'link-craft.onrender.com';
            }
            
            res.cookie('userId', userId, cookieOptions);
        }
        
        const { originalUrl } = req.body
        if(! originalUrl){
            return res.status(400).json({
                success: false,
                message: `URL is required`
            })
        }

        const shortId = nanoid(process.env.LENGTH)
        await urlModel.create({
            userId,
            shortId,
            redirectURL: originalUrl,
            visitHistory: [],
        })

        return res.status(200).json({
            userId,
            success: true,
            shortId,
            message: `Short URL created successfully`
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: `Server error in generate short URL EP, ${err}`
        })
    }
}