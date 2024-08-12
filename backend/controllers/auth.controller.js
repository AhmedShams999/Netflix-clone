import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateWebToken.js";

export const signup = async (req,res)=>{
  try {
    const {username,password,email} = req.body

    if(!username || !password || !email){
      return res.status(400).json({success: false, message: "All fields are required!"})
    }

    const emailRedax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRedax.test(email)){
      return res.status(400).json({success: false, message: "Invalid email"})
    }

    if(password.length < 6){
      return res.status(400).json({success: false, message: "Password must be at least 6 characters"})
    }

    const existingUserEmail = await User.findOne({email: email})

    if(existingUserEmail){
      return res.status(400).json({success: false, message: "Email already exsist"})
    }

    const existingUserUsername = await User.findOne({username: username})
    if(existingUserUsername){
      return res.status(400).json({success: false, message: "Username already exsist"})
    }

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password,salt)

    const PROFILE_PIC = ["/avater1.png","/avater2.png","/avater3.png"]
    
    const image = PROFILE_PIC[Math.floor(Math.random() * PROFILE_PIC.length)]


    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
    })

    // generat cookies when signup

    generateTokenAndSetCookie(newUser._id,res)
    await newUser.save()

    // remove password from response
    return res.status(201).json({success: true, user: {...newUser._doc,password:""}})
  } catch (error) { 
    console.log("Error in signup controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}
export const login = async (req,res)=>{
  try {
    const {email,password} = req.body
    const user = await User.findOne({email: email})

    if(!email || !password){
      return res.status(400).json({success: false, message: "Must provied all fields"})
    }

    if(!user){
      return res.status(400).json({success: false, message: "User not exsist please check your email"})
    }

    const unhashedPassword = await bcrypt.compare(password,user.password)

    if(!unhashedPassword){
      return res.status(400).json({success: false, message: "Password not correct"})
    }

    generateTokenAndSetCookie(user._id,res)

    return res.status(200).json({success: true, user: {...user._doc,password:""}}) 

  } catch (error) {
    console.log("Error in login controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}
export const logout = async (req,res)=>{
  try {
    res.clearCookie("jwt-netflix")
    res.status(200).json({success: true, message: "Logout successfully" } )
  } catch (error) {
    console.log("Error in logout controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}
export const getMe = async (req,res)=>{
  try {
    res.status(200).json({success: true, user: req.user})
  } catch (error) {
    console.log("Error in getMe controller",error.message)
    res.status(500).json({success: false, message: "Internal server error"})
  }
}