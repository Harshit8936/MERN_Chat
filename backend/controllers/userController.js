import {User} from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async(req,res)=>{
    try {
        const {fullname, username, password, confirmPassword, gender} = req.body;
        if(!fullname || !username || !password || !confirmPassword || !gender){
            return res.status(400).json({
                success:false,
                message:"Some filled missed !"
            })
        }
        if(password !==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password do not match"
            })
        }
        const user = await User.findOne({username}).exec();
        if(user){
            return res.status(400).json({
                success:false,
                message:"User name already exist Try different"
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
        // profile photo
        const maleProfile = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfile = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        await User.create({
            fullname,
            username,
            password:hashedPassword,
            gender,
            profilePhoto: gender === 'male' ? maleProfile : femaleProfile,
        })
        return res.status(201).json({
            message:"Registered successfully",
            success:true
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`${error}`
        })
    }
}

// login 

export const login = async(req,res)=>{
    try {
        const {username,password} = req.body;
        if(!username || !password ){
            return res.status(400).json({
                success:false,
                message:"Some filled missed !"
            })
        }
        let user = await User.findOne({username}).exec();
        if(!user){
            return res.status(400).json({
                message:"Username not found or invalid password"
            })
        }
        const isPasswordMatched = await bcrypt.compare(password,user.password);
        if(!isPasswordMatched){
            return res.status(400).json({
                message:"Username not found or invalid password"
            })
        }
        const tokenData = {
            userId:user._id
        }
        const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
        user = {
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            profilePhoto:user.profilePhoto,
            gender:user.gender,
        }
        return res.status(200).cookie("token",token, {maxAge:1*24*60*60*1000, httpOnly:true, sameSite:'strict'}).json({
            message:`Welcome back ${user.fullname}`,
            success:true,
            user
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`${error}`
        })
    }
}


// logout
export const logout = async(req,res)=>{
    try {
        return res.status(200).cookie("token","", {maxAge:0}).json({
            message:`Logged out Successfully`,
            success:true,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`${error}`
        })
    }
}

// other users Listing
export const getOtherUsersList = async(req,res)=>{
    try {
        // logged in user id
        const userId = req.user_id;
        const otherUsers = await User.find({_id:{$ne:userId}}).select('-password').exec();
        if(otherUsers.length<=0){
            return res.status(404).json({
                success:false,
                message:"No Users found",
            })
        }
        return res.status(200).json({
            success:true,
            message:"Users found",
            users:otherUsers
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`${error}`
        })
    }
}