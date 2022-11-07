const router = require("express").Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { registerValidation } = require ('../validation');
const { loginValidation } = require ('../validation');
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
   
    const{error} = registerValidation(req.body);

    if (error){
        return res.status(400).json({error:error.details[0].message})
    }

    const emailExist = await User.findOne({email: req.body.email});

    if(emailExist){
        return res.status(400).json({error: "Email exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password
    });

    try {
        const savedUser = await user.save();
        res.json({ error: null, data: savedUser._id });
    

    } catch (error) {
        res.status(400).json({error: "we have some problem"})
    }
});

router.post("/login", async (req, res) => {
    const{error} = loginValidation(req.body);

    if (error){
        return res.status(400).json({error:error.details[0].message})
    }

    const user= await User.findOne({email: req.body.email});

    if(!user){
        return res.status(400).json({error: "No user"});
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if(!validPassword){
        return res.status(400).json({error: "Wrong password"});
    }

    const token = jwt.sign(
        {
            name: user.name,
            id: user._id
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }, 
    );

    res.header("auth-token", token).json({
        error: null,
        data: { token }
    });
})

module.exports = router;