import urlModel from "../models/url.model.js";

export default async function analytics(req,res) {
    try{
        const shortId = req.params.shortId
        const entry = await urlModel.findOne({ shortId })

        if(!entry){
            return res.status(400).json({
                success: false,
                message: `Invalid shortid`
            })
        }

        return res.status(200).json({
            clicks: entry.visitHistory.length,
            analytics: entry.visitHistory
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: `Error in analytics EP, ${err}`
        })
    }
}