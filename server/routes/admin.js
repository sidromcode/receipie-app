const express = require('express');
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;


const adminLayout = '../views/layouts/admin';

/**
 * GET: ADMIN_LOGIN
 */
router.get('/admin',async (req,res)=>{
    
    try {
        const locals = {
            "title":"ADMIN",
            "Description":"This is my first Blog app"
        }
        
        res.render('admin/index.ejs',{locals, layout:adminLayout});
    } catch (error) {
        console.log(error);
    }
    
});


router.get('/dasboard',async (req,res)=>{
    
    try {
        const {username,password} = req.body; 
        const user = await User.findOne({username});
        if(!user){
            res.status(401).json({message:'invalid credentials'});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            res.status(401).json({message:'invalid password'})
        }

        const token = jwt.sign({userId:user._id},JWT_SECRET);
        res.cookie('token',token);
        res.redirect('/dashboard');


        
    } catch (error) {
        console.log(error);
    }
    
});

// **
//  * GET: DASHBOARD
//  */
router.get('/dashboard',(req,res)=>{
    res.render('admin/dashboard.ejs');
})






// **
//  * POST: ADMIN_REGISTER
//  */

router.post('/register',async (req,res)=>{
    
    try {
        const {username,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        try {
            const user = await User.create({username,password:hashedPassword});
            res.status(201).json({message:'user created',user});
        } catch (error) {
            if(error.code===11000){
                res.status(409).json({message:'user already in use'});
            }
            res.status(500).json({messaage:'Internal server error'});
        }
        
    } catch (error) {
        console.log(error);
    }
    
});













module.exports = router;