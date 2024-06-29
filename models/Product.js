const mongoose=require('mongoose')
const validator=require('validator')

const ProductSchema= new mongoose.Schema({
    name: {type:String,trim:true, required:[true,'Please Provide Name'], maxlength:[100, 'Name can not be more than 100 characters']},    
    price: {type:Number,required:[true,'Please Provide Price'],default:0},
    description: {type:String, required:[true,'Please Provide Description'], maxlength:[1000, 'Description can not be more than 1000 characters']},    
    image: {type:String, default:'/uploads/example.jpeg'},    
    category: {type:String, required:[true,'Please Provide Category'], enum:['office','kitchen','bedroom']},    
    company: {type:String, required:[true,'Please Provide Company'], enum: {
        values:['ikea','liddy','marcos'],
        message:'{VALUE} is not supported'
     }},    
    colors: {type:[String], default:['#222'], required:[true,'Please Provide Color']},    
    featured: {type:Boolean, default:false},
    freeShipping: {type:Boolean, default:false},
    inventory: {type:Number,required:[true,'Please Provide Inventory'],default:0},
    averageRating: {type:Number,default:0},
    numOfReviews:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true   
    },
}, {timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}}
)

ProductSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'product',
    justOne:false
})

ProductSchema.pre('remove', async function(){
    await this.model('Review').deleteMany({product:this._id})
})


module.exports=mongoose.model('Product',ProductSchema)
