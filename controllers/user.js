const user = {}
const userModel = require('../model/user');
const jwt = require('jsonwebtoken');

user.getAll = async (req, res) => {
    try{
        if(res.locals.user){
            const users = await userModel.find();
            res.status(200).json({
                msg : 'get users',
                count : users.length,
                userData : users.map((user, i) => {
                    return {
                        name : user.name,
                        email : user.email
                    }
                })
            })
        }
        else{
            res.status(400).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
user.get = async (req, res) => {
    const id = req.params.userId;
    try{
        if(res.locals.user){
            const user = await userModel.findById(id);
            if(!user){
                return res.status(400).json({
                    msg : "not userId"
                })
            }
            else{
                res.status(200).json({
                    msg : "get user",
                    userData : user
                })
            }
        }
        else{
            return res.status(400).json({
                msg : 'not token'
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
user.signup = async (req, res) => {
    const { name, email, password } = req.body
    try{
        const user = await userModel.findOne({email});
        if(user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            const user = new userModel({
                name, email, password
            });
            await user.save();
            res.status(200).json({
                msg : "success signup",
                userData : user
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
user.login = async (req,  res) => {
    const { email, password } = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            await user.comparePassword(password, (err, isMatch) => {
                if(err || !isMatch){
                    return res.status(400).json({
                        msg : "not match password"
                    })
                }
                else{
                    const payload = {
                        id : user._id,
                        email : user.email
                    }
                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {
                            expiresIn : '1h'
                        }
                    )
                    res.status(200).json({
                        msg : "success login",
                        token : token,
                        userData : user
                    })
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
user.update = async (req, res) => {
    const id = req.params.userId;
    try{
        if(res.locals.user){
            const user = await userModel.findByIdAndUpdate(id, {$set : {
                            name : req.body.name,
                            email : req.body.email
                        }});
            if(!user){
                return res.status(400).json({
                    msg : "not userId"
                })
            }
            else{
                res.status(200).json({
                    msg : 'update user by id: ' + id
                })
            }
        }
        else{
            return res.status(400).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
user.deleteAll = async (req, res) => {
    try{    
        if(res.locals.user){
            await userModel.remove();
            res.status(200).json({
                msg : 'delete users'
            })
        }
        else{
            return res.status(400).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
user.delete = async (req, res) => {
    const id = req.params.userId;
    try{
        if(res.locals.user){
            const user = await userModel.findByIdAndRemove(id);
            if(!user){
                return res.status(400).json({
                    msg : "not userId"
                })
            }
            else{
                res.status(200).json({
                    msg : "delete user by id: " + id
                })
            }
        }
        else{
            return res.status(400).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

module.exports = user