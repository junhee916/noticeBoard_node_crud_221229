const commend = {}
const commendModel = require('../model/commend');
commend.get = async (req, res) => {
    const id = req.params.commendId;
    try{
        if(res.locals.user){
            const commend = await commendModel.find()
                                .populate('user', ['email'])
                                .populate('board', ['board']);
            if(!commend){
                return res.status(400).json({
                    msg : "not boardId"
                })
            }
            else{
                res.status(200).json({
                    msg : "get commend",
                    commendData : commend
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
commend.save = async (req, res) => {
    const id = req.params.boardId;
    try{
        const newCommend = new commendModel({
            user : res.locals.user.id,
            board : id,
            commend : req.body.commend
        });
        if(res.locals.user){    
            const commend = await newCommend.save();
            res.status(200).json({
                msg : "save commend",
                commendData : commend
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
commend.update = async (req, res) => {
    const id = req.params.commendId;
    try{
        if(res.locals.user){
            const commend = await commendModel.findByIdAndUpdate(id, {$set : {
                                user : res.locals.user.id,
                                board : id,
                                commend :req.body.commend
                            }});
            if(!commend){
                return res.status(400).json({
                    msg : "not commendId"
                })
            }
            else{
                res.status(200).json({
                    msg : "update commend by id: " + id
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
commend.delete = async (req, res) => {
    const id = req.params.commendId;
    try{
        if(res.locals.user){
            const commend = await commendModel.findByIdAndRemove(id);
            if(!commend){
                return res.status(400).json({
                    msg : "not commendId"
                })
            }
            else{
                res.status(200).json({
                    msg : "delete commend by id: " + id
                })
            }
        }
        else{
            return res.status(400).json({
                msg : "not commendId"
            })
        }
    }
    catch(err){
        return res.status(500).json({
            msg : err.message
        })
    }
};

module.exports = commend