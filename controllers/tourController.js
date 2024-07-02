const fs = require('fs');

const express = require('express')

const tourModel = require(`${__dirname}/../models/tourModel`)


const app =express()

//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,'utf-8'));


exports.checkBody = (req,res,next)=>{
    if(!req.body.name || !req.body.price){

        return res.status(404).json({
            status:"Fail",
            message:"Invalid tour"
        })


    }
    next();
}

/*exports.checkId =(req,res,next,val)=>{ 
    if (req.params.id *1 > tours.length){
    return res.status(404).json({
    status:"Fail",
    message:"Tour not found "
    })    
    }  
    
    next();
}*/
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status:"success",
        requestTime:req.requestTime,
        data:{
            //tours
        }
    })
}
exports.getTour = (req, res) => {// :id? optional parameter
    const id = req.params.id *1
    //const reqtour = tours.find(el => el.id === id)
    /*
        if (id > tours.length){
            return res.status(404).json({
            status:"Failed",
            message:"Tour not found "
        })    
        }
    */
            res.status(200).json({
            status:"success",
            data:{
                //reqtour
            }
        })
}
exports.addTour =  (req, res)=>{
    //const newId = tours[tours.length - 1].id + 1;
    //const newTour = Object.assign({id : newId}, req.body);
    tours.push(newTour);
    fs.writeFile("./dev-data/data/tours-simple.json",JSON.stringify(tours),err=>{
        if(err) res.status(500).send(err);
        res.status(201).json({
            status:200,
            data:{
                //tours: newTour
            }
        })
    })
}
exports.updateTour = (req,res)=>{

    console.log(req.body)  
    res.status(200).json({status:"success",
        data:{
            tour:"Updated tour here..."
        }

    })
}
exports.deleteTour = (req,res)=>{
   
    res.status(204).json({
        "sataus":"success",
        "message":null
        })

}
