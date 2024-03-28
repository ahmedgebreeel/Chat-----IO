
export const sendMessage = async (req,res)=>{
    try {
        const receiverId = req.params.id;
        const {message} = req.body;
        const senderId = req.user._id;

    } catch (error) {
        console.log("error in sendMessage controller", error.message);
        return res.status(500).json({error: "Internal server error"});
    }
}