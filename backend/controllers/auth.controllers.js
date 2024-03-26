import User from '../models/user.model.js';

export const register = async(req, res)=>{

    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;
        if (password !== confirmPassword) {
            res.status(400).json({error: "password don't match"});
        }

        const user = await User.findOne({username});
        if (user){
            res.status(400).json({error: "user already exists"});
        }

        // hash password
        // https://avatar-placeholder.iran.liara.run/

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password,
            gender,
            profilePic : gender === 'male' ? boyProfilePic : girlProfilePic
        })

        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        })


    } catch (error) {
        console.log("error in register controller", error.message);
        res.status(500).json({error: "Internal server error"})
    }
}

export const login = (req,res)=>{
    res.send("login")
}

export const logout = (req,res)=>{
    res.send("logout");
}

