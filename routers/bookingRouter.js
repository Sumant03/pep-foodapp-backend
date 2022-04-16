const express=require("express");
const bookingModel = require("../models/bookingModel");
const { protectRoute,isAuthorized,bodyChecker } = require("./myMiddleWare");
let bookingRouter= express.Router();
const {getElement,getElements,updateElement}=require("../helpers/factory");
const userModel = require("../models/userModel");
const Razorpay = require("razorpay");
let { KEY_ID, KEY_SECRET } = process.env||require("../secrets");
var razorpay = new Razorpay({
    key_id:process.env||KEY_ID,
    key_secret:process.env||KEY_SECRET
});


const getbooking=getElement(bookingModel);
const getbookings=getElements(bookingModel);
const updatebookings=updateElement(bookingModel);



//createbooking

//booking:-> put entry  
//->go in plan , 
//->new booking has come so we will 
//->update its avarage rating
//-> plan.booking add-> bookingID (add booking) 

const initiateBooking =async function(req,res){
    
    try{
    let booking =await bookingModel.create(req.body);
    let bookingId= booking["_id"];
    let userId=req.body.user;
    let user=await userModel.findById(userId);
    user.booking.push(bookingId);
    await user.save();
    
    const payment_capture = 1;
  const amount = 500;
  const currency = "INR";

  const options = {
    key:key_id,
    amount,
    currency,
    receipt: `rs${bookingId}`,
    payment_capture,
  };

    const response = await razorpay.orders.create(options);
    console.log(response);
    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
      "message":"booking initiated",
      booking:booking
    });

   }
   catch(err){
      res.send(500).json({
          message:err.message
      })
   }
} 

//deletebooking

const deleteBooking=async function(req,res){
    try{
        let booking =await bookingModel.findByIdAndDelete(req.body.id);
        console.log("booking",booking);
        let bookingId= booking["_id"];
        let idxOfBooking=user.booking.indexOf(bookingId);
        let userId=booking.user;
        let user=await userModel.findById(userId);
        user.booking.splice(idxOfBooking,1);
        await user.save();
        
        res.status(200).json({
            "message":"booking deleted",
            booking:booking
        })
       }
       catch(err){
          res.send(500).json({
              message:err.message
          })
       }
}

// verify booking just like jwt
async function verifyPayment(req, res) {
  // JWT 
  const secret = KEY_SECRET;

  // console.log(req.body);
  // 
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      res.status(200).json({
          message: "OK",
      });
  } else {
      res.status(403).json({ message: "Invalid" });
  }
};

bookingRouter
    .route("/verification")
    .post(verifyPayment)

bookingRouter
     .route(":/id")
     .get(getbooking)
     .patch(protectRoute,updatebookings)
     .delete(protectRoute,deleteBooking)

bookingRouter
     .route("/")
     .get(getbookings)
     .post(protectRoute,initiateBooking)


module.exports=bookingRouter;