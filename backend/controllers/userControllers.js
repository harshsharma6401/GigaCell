const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

// /api/user?search=harsh
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [ //OR operator
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
                                                        // $ne -> Not equal to, except this user send all
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});


const registerUser = asyncHandler (async (req,res) => {

    const {name,email,password,pic} = req.body;

    if ( !name || !email || !password)
    {
        res.status(400);
        throw new Error('Please Enter all the Fields');
    }

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error('User already Exists');
    }

    const user = await User.create({
        name,email,password,pic
    });

    if(user)
    {
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token: generateToken(user._id)
        });
    }
    else{
        res.status(400);
        throw new Error('Failed to create user');
    }

});

const authUser = asyncHandler(async (req,res) =>{

    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password)))
    {
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        });
    }


})



module.exports = { registerUser, authUser, allUsers };