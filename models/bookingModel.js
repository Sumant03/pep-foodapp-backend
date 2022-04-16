const mongoose=require("mongoose");
let {PASSWORD}=require("../secrets");
let db_link= `mongodb+srv://admin:${PASSWORD}@cluster0.ankfz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


mongoose.connect(db_link,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(
    function(connection){
       console.log(connection);
    }
).catch(function(err){
 console.log("error",err);
})


const bookingSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        required:true

    },
    plan:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    priceAtThatTime:{
        type:Number,
        required:true
    },
    bookeAt:{
       type:Date
    },

    status:{
        type:String,
        enum:["pending","failed","success"],
        required:true,
        default:"pending"
    }
})

let bookingModel=mongoose.model("bookingModel",bookingSchema);
module.exports =bookingModel;