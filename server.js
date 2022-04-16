const express =require("express");
const fs=require("fs");
const {key}=require("./secrets");
// const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

const app=express();
const userRouter=require("./routers/userRouter");
const authRouter=require("./routers/authRouter");
const planRouter=require("./routers/planRouter");
const reviewRouter=require("./routers/reviewRouter");
const bookingRouter=require("./routers/bookingRouter");

app.use(express.json());
app.use(cookieParser())
app.use(express.static("public"));


app.use('/user',userRouter);
app.use('/auth',authRouter);
app.use('/plan',planRouter);
app.use('/review',reviewRouter);
app.use('/booking',bookingRouter);

app.listen(process.env.PORT||8081,function(){
    console.log("server started");
})

//404 Error
app.use(function(req,res){
    res.status(400).json({
         message:"404 page not found"
    })
})





