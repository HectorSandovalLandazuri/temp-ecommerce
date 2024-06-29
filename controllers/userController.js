const {StatusCodes}=require('http-status-codes')
const User =require('../models/User')
const CustomError = require('../errors')
const {createTokenUser,attachCookiesToResponse,checkPermissions}=require('../utils')

const getAllUsers=async (req,res)=>{
    const users=await User.find({role:'user'}).select('-password')
    res.status(StatusCodes.OK).json({users})
}

const getSingleUser=async (req,res)=>{
    const user=await User.findOne({_id:req.params.id}).select('-password')
    if (!user){
        throw new CustomError.NotFoundError(`No User with id: ${req.params.id}`)    
    }
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({user})
}

const showCurrentUser=async (req,res)=>{
    res.status(StatusCodes.OK).json({user:req.user})
}

//Update User with user.save
const updateUser=async (req,res)=>{
    const {name,email}=req.body;
    if (!name || !email) {
        throw new CustomError.BadRequestError('Please provide both values')
    }
    
    const user=await User.findOne({_id:req.user.userId});
    user.email=email;
    user.name=name;
    await user.save()
    const tokenUser=createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}


const updateUserPassword=async (req,res)=>{
    const {oldPassword,newPassword}=req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both values')
    }
    
    const user = await User.findOne({_id:req.user.userId})
    isPasswordCorrect= await user.comparePassword(oldPassword)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }

    user.password=newPassword
    await user.save()
    res.status(StatusCodes.OK).json({msg:'Success! Password Updated'})
 
}

module.exports= {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}
/* Update user with findOneAndUpdate
const updateUser=async (req,res)=>{
    const {name,email}=req.body;
    if (!name || !email) {
        throw new CustomError.BadRequestError('Please provide both values')
    }
    const user = await User.findOneAndUpdate({_id:req.user.userId},{name,email},{new:true,runValidators:true})
    const tokenUser=createTokenUser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}
*/
