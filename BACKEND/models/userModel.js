const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const crypto=require('crypto')

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter name']
    },
    email:{
        type:String,
        required:[true,'please enter email'],
        unique:true,
        validate:[validator.isEmail, 'please enter valid email address']
    },
    password:{
        type:String,
        required:[true,'please enter password'],
        maxlength:[6,'password cannot exceed 6 characters'],
        select:false
    },
    avatar:{
        type:String,
    },
    role:{
        type:String,
        default:'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }
    this.password = await bcrypt.hash(this.password, 10)
})



userSchema.methods.getJwtToken= function(){
    return jwt.sign({id: this.id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

userSchema.methods.isValidpassword=async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password)
}


userSchema.methods.getResetToken = function () {
    const token = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return token;
};


let model=mongoose.model('User',userSchema)
module.exports=model