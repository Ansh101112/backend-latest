const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');

//register

router.post("/register", async(req,res)=>{
    try{
        //generating a new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        
        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        //save user and send response
        const user = await newUser.save();
        res.status(200).json(user._id);
    }catch(err){
        res.status(200).json(err);
    }
})


//login

router.post("/login", async (req, res) => {
    try {
        // Find user
        const user = await User.findOne({
            username: req.body.username
        });
        
        // Check if user exists
        if (!user) {
            return res.status(400).json("Wrong username or password!!");
        }
        
        // Validate the password
        const validPwd = await bcrypt.compare(req.body.password, user.password);
        
        // Check if password is valid
        if (!validPwd) {
            return res.status(400).json("Wrong username or password!!");
        }
        
        // Send success response
        res.status(200).json({
            _id: user._id,
            username: user.username
        });
    } catch (err) {
        res.status(500).json(err);
    }
});






module.exports = router;