import urlModel from "../models/url.model.js";

export default async function linkHistory(req,res) {
    try{
        const userId = req.cookies.userId

        if(! userId){
            return res.status(400).json({
                success: false,
                message: `Invalid user`
            })
        }
        const history = await urlModel.find( {userId} )

        return res.status(200).json({
            success: true,
            history,
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: `Server error at EP, ${err}`
        })
    }

}