const mongoose=require('mongoose')
const validator=require('validator')

const SingleOrderItemSchema=mongoose.Schema({
    name: {type:String,required:true},
    image: {type:String,required:true},
    price: {type:Number,required:true},
    amount: {type:Number,required:true},
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Product',
        required:true   
    }
})

const OrderSchema= new mongoose.Schema({
    tax: {type:Number,required:[true,'Please Provide Tax'],default:0},
    shippingFee: {type:Number,required:[true,'Please Provide Shipping Fee'],default:0},
    subtotal: {type:Number,required:[true,'Please Provide Subtotal'],default:0},
    total: {type:Number,required:[true,'Please Provide Total'],default:0},
    orderItems: [SingleOrderItemSchema],    
    status: {
        type:String,
        enum:['pending','failed','paid','delivered','canceled'],
        default:'pending'
    },    
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true   
    },
    clientSecret: {
        type:String,
        required:true
    },
    paymentId: {
        type:String
    },

}, {timestamps:true}
)

OrderSchema.pre('save',async function(){
    console.log('post save hook called');    
})

module.exports=mongoose.model('Order',OrderSchema)