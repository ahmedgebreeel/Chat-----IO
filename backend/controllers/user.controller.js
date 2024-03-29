import User from "../models/user.model.js";

export const getUsers = async (req, res)=>{

    try {
        const currentUserId = req.user._id;

        const users = await User.find({_id: {$ne: currentUserId}}).select("-password");

        return res.status(200).json(users);
    } catch (error) {
        console.log("error in getUsers controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
} 