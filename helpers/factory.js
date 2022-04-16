const { element } = require("xml");

function createElement(model){
 return  async function(req,res){
      
        try{
            let element=await model.create(req.body);
            res.status(200).json({
                "message":"element added in database",
                data:element
            })
    
        }catch(err){
            res.status(404).json({
                "message":err.message
            })
        }
        }
}

function getElement(model){
 return  async function(req,res){
        let {id}=req.params;
        try{
            let user=await model.findById(id);
            res.status(200).json({
                "message":"user found in database",
                data:user
            })
    
        }
        catch(err){
            res.status(404).json({
                "message":err.message
            })
        }
        
        }
}

function getElements(model){
  return  async function(req,res){
        let requestQuery;
      try{

        if(req.query.myQuery){
        requestQuery= model.find(req.query.myQuery)                  
        }
        else{
            requestQuery=model.find();
        }

        //sort
        if(req.query.sort){
            requestQuery=requestQuery.sort(req.query.sort);
        }
        //select

        if(req.query.select){

            let params=req.query.split("%").join(" ");
            requestQuery=requestQuery.select(params);
        }

        //paginate
        let page =Number(req.query.page)||1;
        let limit=Number(req.query.limit)||4;
        let toSkip=(page-1)%limit;

        requestQuery=requestQuery.skip(toSkip).limit(limit);

        let elements=await requestQuery

        res.status(200).json({
            "message":elements
        })
    }catch(err){
        res.status(404).json({
            "message":err.message
        })
    }
    }
}

function updateElement(model){
  return  async function(req,res){
        let {id} =req.params;
        // console.log("getting req.params from factory");
        try{
            // console.log("2");
            let element=await model.findById(id);
            if(element){
                // console.log("3");
                if(req.body.password||req.body.confirmPassword){
                    return res.json({
                        "message":"use forget password instead"
                    })
                }
               
                for(let key in req.body){
                    element[key]=req.body[key];
                }
                await element.save({
                    validateBeforeSave:false
                });
                // console.log("4");
                res.status(200).json({
                    "message":"data updated",
                    data:element
                })
            }
    
        }
        catch(err){
            res.status(404).json({
                "message":err.message
            })
        }
    }
}

function deleteElement(model){
 return  async function(req,res){
        let {id} =req.params;
        try{
             let element=await model.findByIdAndDelete(id);
             res.status(200).json({
                 "message":"user data deleted ",
                 element:element
             })
        }
        catch(err){
            res.status(404).json({
                "message":err.message
            })
        }
        }
}

module.exports={createElement,getElement,getElements,deleteElement,updateElement}