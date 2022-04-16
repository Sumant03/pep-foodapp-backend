const { val } = require("cheerio/lib/api/attributes");
const { validate } = require("email-validator");
const mongoose=require("mongoose");
let {PASSWORD}=process.env||require("../secrets");
let db_link= `mongodb+srv://admin:${PASSWORD}@cluster0.ankfz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const validator = require("email-validator");

mongoose.connect(db_link).then(
    function(connection){
      console.log(connection);
    }
).catch(function(err){
 console.log("error",err);
})


const userSchema=mongoose.Schema({
   name:{
     type:String,
     required:true,
     unique:true
   },
   email:{
    type:String,
    required:true,
    unique:true,
    validate:function(){
       return validator.validate(this.email)
    }
   },
   password:{
     type:String,
     required:true,
     minlength:8
   },
   confirmPassword:{
       type:String,
       required:true,
       minlength:8,
       validate:function(){
           return this.password==this.confirmPassword
       }

   },
   createdAt:{
    type:Date
},
  token:{
   type:Date,
   default:Date.now()
  },
  validateUpto:Date
  ,role:{
    type:String,
    enum:["admin","ce","user"],
  //enum is used to disaply specified values . like in weekdays names we have only 7 specified values
    default:"user"
  },
  booking:{
    type:[mongoose.Schema.ObjectId],
    ref:"bookingModel"
  }


})

//hook to change data before it get saved
userSchema.pre('save', function(next) {
  // do stuff
  this.confirmPassword=undefined;
  this.token=undefined;
  next();
});



let userModel=mongoose.model("userModel",userSchema);
module.exports =userModel;