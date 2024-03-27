import jwt from "jsonwebtoken"

const generateTokenAndSetCookie = (userId, res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_IN
    })

    res.cookie("jwt", token)
}




export default generateTokenAndSetCookie;