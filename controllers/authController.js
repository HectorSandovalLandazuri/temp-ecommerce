const User = require ('../models/User')
const {StatusCodes}=require('http-status-codes')
const CustomError = require('../errors')
const {attachCookiesToResponse,createTokenUser}= require('../utils')


const register=async (req,res)=>{
    const {email,name,password}=req.body

    const emailExists=await User.findOne({email})
    if (emailExists){
        throw new CustomError.BadRequestError('Email already exists')
    }

    //First Registered User is Admin
    const isFirstUser=await User.countDocuments({}) === 0;
    const role= isFirstUser?'admin': 'user'

    const user=await User.create({name,email,password,role});

    const tokenUser=createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser})
}

const login=async (req,res)=>{
    const {email,password}=req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})
    if (!user){
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    isPasswordCorrect= await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }
    const tokenUser=createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}

const logout=async (req,res)=>{
    res.cookie('token','logout',{
        httpOnly:true,
        expires:new Date (Date.now())    
    })
    res.status(StatusCodes.OK).json({msg:'User logout'})
}

module.exports= {
    register,
    login,
    logout
}