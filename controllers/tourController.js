const fs = require('fs');

const express = require('express')

const Tour = require(`${__dirname}/../models/tourModel`)


const app =express()

//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,'utf-8'));


/*exports.checkBody = (req,res,next)=>{
    if(!req.body.name || !req.body.price){

        return res.status(404).json({
            status:"Fail",
            message:"Invalid tour"
        })


    }
    next();
}

exports.checkId =(req,res,next,val)=>{ 
    if (req.params.id *1 > tours.length){
    return res.status(404).json({
    status:"Fail",
    message:"Tour not found "
    })    
    }  
    
    next();
}*/
exports.getAllTours =async (req, res) => {
    try{
        const queryOBJ = {...req.query}
        const execludeFields = ['page','limit','sort','fields']
        execludeFields.forEach(el => delete queryOBJ[el]) 
        const query = Tour.find(queryOBJ)

    //const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')
        const tours = await query
        res.status(200).json({
            status:"success",
            data:{
                tours
            }
        })
    }catch(err){
        res.status(400).json({
            status:"Fail",
            message: err.message
        })
    }   
}
exports.getTour = async (req, res) => {// :id? optional parameter
    try{
        const reqtour = await Tour.findById(req.params.id)
        res.status(200).json({
            status:"success",
            data:{
                    reqtour
                }
            })
    }catch(err){
        res.status(400).json({
            status:"Fail",
            message:err.message
        })
    }
}
exports.addTour = async (req, res)=>{
    try{
        const newTour = await Tour.create(req.body)
        res.status(201).json({
        status:"success",
        data:{
            tour:newTour
        }
         })
        console.log("New tour was added")
    }catch(err){
        console.log(err)
        res.status(400).json({
            status:"Fail",
            message:err.message
            
        })
    }
}
exports.updateTour =async (req,res)=>{

    try{

        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })


        res.status(200).json({status:"success",
            data:{
                tour
            }
    
        })

    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err.message
        })
    }
}
exports.deleteTour = async (req,res)=>{
    try{
        await Tour.findByIdAndDelete(req.params.id)
        res.status(200).json({
            "sataus":"success"
        })

    }catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
    
}
