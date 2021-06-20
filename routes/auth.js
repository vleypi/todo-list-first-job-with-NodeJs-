const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check,validationResult} = require('express-validator')
const config = require('config')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const router = Router()

router.post('/register',[
    check('email','Uncorrect email').isEmail(),
    check('password','Minimal size of password is 6 symbols').isLength({min: 6})
], async(req,res)=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message: 'Uncorrect data',errors: errors.array()})
        }
        const {email,password} = req.body
        const guest = await User.findOne({email})
        if(guest){
            return res.status(400).json({message: 'This user is already exists'})
        }
        const hashedPassword = await bcrypt.hash(password,14)
        const user = new User({
            email,
            password: hashedPassword
        })
        await user.save()
        res.status(201).json({message: 'User created'})
    }
    catch(err){
        console.log(err.message)
    }
})
router.post('/login',[],async (req,res)=>{
    try{
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message: 'user does not exists'})
        }
        const isMatchPass = await bcrypt.compare(password,user.password)
        if(!isMatchPass){
            return res.status(400).json({message: 'Uncorrect password'})
        }
        const token = jwt.sign({userId: user.id},config.get("secretKey"),{expiresIn: '1h'})
        res.json({token,userId: user.id})
    }
    catch(err){
        console.log(err.message)
    }
})

module.exports = router