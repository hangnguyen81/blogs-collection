const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.get('/', async(req, res)=>{
    const allUsers = await User.find({}).populate('blogs',{title:1, likes:1});
    res.json(allUsers);
});

usersRouter.post('/', async(req, res) =>{
    const body = req.body;

    if(!body.username || !body.password){
        return res.status(400).json({error: 'username or password must be given'});
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,     
    });

    const savedUser = await user.save();
    res.json(savedUser);
});

module.exports = usersRouter;