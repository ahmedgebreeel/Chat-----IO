import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import generateTokenAndSetCookie from '../utils/generateToken.js';


export const register = async(req, res)=>{

    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;
        if (password !== confirmPassword) {
         return   res.status(400).json({error: "password don't match"});
        }

        const user = await User.findOne({username});
        if (user){
          return  res.status(400).json({error: "user already exists"});
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run/

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic : gender === 'male' ? boyProfilePic : girlProfilePic
        })

        if (newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

           return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            })
    
        }else {
            return res.status(400).json({error: "invalid user data"})
        }
       

    } catch (error) {
        console.log("error in register controller", error.message);
       return res.status(500).json({error: "Internal server error"})
    }
}

export const login = async(req,res)=>{
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        
        if(!user){
         return  res.status(404).json({error: "invalid username or password"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user?.password);
        if (!isPasswordCorrect){
            return  res.status(404).json({error: "invalid username or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });
        
    } catch (error) {
        console.log("error in login controller", error.message);
        return  res.status(500).json({error: "Internal server error"});
    }
}

export const logout = (req,res)=>{
   try {
    res.cookie("jwt", "", {maxAge: 0});
    return res.status(200).json({message: "logout successfully"});
    
   } catch (error) {
    console.log("error in logout controller", error.message);
    return res.status(500).json({error: "Internal server error"});
   }
}


