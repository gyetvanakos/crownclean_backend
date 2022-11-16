const router = require("express").Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const {
    registerValidation
} = require('../validation');
const {
    loginValidation
} = require('../validation');
const {
    verifyToken
} = require("../validation");
const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const cache = new NodeCache({
    stdTTL: 600
});

//picture upload/storage


router.post("/register", async (req, res) => {

    const {
        error
    } = registerValidation(req.body);

    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }

    const emailExist = await User.findOne({
        email: req.body.email
    });

    if (emailExist) {
        return res.status(400).json({
            error: "Email exists"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password,
    });

    try {
        const savedUser = await user.save();
        res.json({
            message: "Succesful registration",
            error: null,
            data: savedUser._id
        });


    } catch (error) {
        res.status(400).json({
            error: "Unsuccesful registration"
        })
    }
});

router.put("/:id", verifyToken, async (req, res) => {


    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    req.body.password=password;
    const id = req.params.id;
    

    users.findByIdAndUpdate(id, req.body)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: "Cannot update user id=" + id
                })
            } else {
                res.send({
                    message: "user profile is updated"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "error updating user with id=" + id
            });
        });

});

router.get("/", /*verifyToken,*/ async (req, res) => {
    try {
        let data = await users.find();
        res.send(data);

    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
});

router.get("/:userId", verifyToken, async  (req, res) => {
    const userId = req.params.userId;

        try{
            let usersCache = cache.get('userByUserId');
    
    
            if(!usersCache) {
                let data = await users.findById(userId);
                console.log("No cache data found. Fetching from DB....");
                //cache.set('userByUserId', data, 30);
    
                res.send((data));
            }
    
            else{
                console.log("Cache found :]");
                res.send((usersCache));
            }
    
        }
        catch(err){
            res.status(500).send({message: err.message})
        }
    });



router.post("/login", async (req, res) => {
    const {
        error
    } = loginValidation(req.body);

    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }

     const emailCheck = await User.findOne({
        email: req.body.email
    });

    if (!emailCheck) {
        return res.status(400).json({
            error: "Incorrect email"
        });
    }

    const user = await User.findOne({
        email: req.body.email
    });


    if (!user) {
        return res.status(400).json({
            error: "No user"
        });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) {
        return res.status(400).json({
            error: "Wrong password"
        });
    }

    const token = jwt.sign({
            id: user._id,
        },
        process.env.TOKEN_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        },
    );

    res.header("Authorization", token).json({
        message: "Logged in succesfully",
        error: null,
        data: {
            token,
            userId: user._id,
            name: user.name,
            email: user.email
        },

    });
})

module.exports = router;