import urlModel from "../models/url.model.js"

export default async function redirectURL(req, res) {
    try {
        const shortId = req.params.shortId
        const entry = await urlModel.findOne({ 
                shortId 
            }
        )

        if (!entry) {
            return res.status(400).json({
                success: false,
                message: `Invalid Shortid`
            })
        }

    
        await urlModel.updateOne({ 
                shortId 
            }, 
            { 
                $push: { 
                    visitHistory: { 
                        timestamp: new Date().toLocaleDateString()
                    } 
                } 
            }
        )

        return res.redirect(entry.redirectURL)
    } catch(err) {
        return res.status(500).json({
            success: false,
            message: `Server error in redirect url EP, ${err}`
        })
    }
}