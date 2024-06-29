const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const UserSchema= new mongoose.Schema({
    name: {type:String, required:[true,'Please Provide Name'], minlength:3, maxlength:50},    
    email: {type:String, 
        unique:true,
        required:[true,'Please Provide Email'],
        validate:{
            validator: validator.isEmail,
            message:'Please Provide valid email'     
        }},
    password: {type:String, required:[true,'Please Provide Password'], minlength:6},    
    role: {type:String, enum:['admin','user'],default:'user'},    
})

UserSchema.pre('save',async function(){
    if (this.isModified('password')){
        const salt=await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password,salt);
    }
})

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch=await bcrypt.compare(candidatePassword,this.password)    
    return isMatch
}



module.exports=mongoose.model('User',UserSchema)