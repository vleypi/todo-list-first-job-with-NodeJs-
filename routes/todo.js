const {Router} = require('express')
const Task = require('../models/tasks')
const auth = require('../middleWare/auth.middleware')
const shortid = require('shortid')
const router = new Router()

router.get('/',auth, async (req,res)=>{
    try{
        const tasks = await Task.find({owner: req.user.userId})
        console.log(req.user.userId)
        res.json(tasks)
    }   
    catch(err){
        res.status(400).json({message: 'Bad request'})
    }
})

router.post('/create',auth,async (req,res)=>{
    try{
        const task = new Task({
            title: req.body.title,
            isFinished: false,
            id: shortid.generate(),
            owner: req.user.userId
        })
        await task.save()
        res.status(201).json({task})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'Bad request'})
    }
})

router.delete('/delete',auth,async (req,res)=>{
    try{
        await Task.deleteOne({id: req.body.task.id})
        res.status(200).json({message: 'update'})
    }
    catch(err){
        res.status(500).json({message: 'Bad request'})
    }
})

router.patch('/edit',auth,async (req,res)=>{
    try{
        await Task.findOneAndUpdate({id: req.body.task.id},{$set: {title: req.body.editTask.title}})
        res.status(200).json({message: 'update'})
    }
    catch(err){
        res.status(500).json({message: 'Bad request'})
    }
})

router.patch('/finish',auth,async (req,res)=>{
    try{
        await Task.findOneAndUpdate({id: req.body.task.id},{$set: {isFinished: true}})
        res.status(200).json({message: 'update'})
    }
    catch(err){
        res.status(500).json({message: 'Bad request'})
    }
})

module.exports = router


