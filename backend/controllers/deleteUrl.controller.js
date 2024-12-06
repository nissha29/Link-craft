import urlModel from "../models/url.model.js";

export default async function(req, res) {
    try {
        const id = req.params.id;

        const findUserWithId = await urlModel.findById(id);
        if (!findUserWithId) {
            return res.status(400).json({
                success: false,
                message: `Invalid URL id`,
            });
        }

        await urlModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: `URL deleted successfully`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error in delete URL EP, ${err.message}`,
        });
    }
}
