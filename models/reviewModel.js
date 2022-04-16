const mongoose=require("mongoose");
let {PASSWORD}=process.env||require("../secrets");
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


const reviewSchema=mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review can't be empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Review must contain some rating"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must belong to a user"],
        ref: "userModel"
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "planModel",
        required: [true, "Review must belong to a plan "]
    }

})

let reviewModel=mongoose.model("reviewModel",reviewSchema);
module.exports =reviewModel;