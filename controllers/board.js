const board = {}
const boardModel = require('../model/board');
board.getAll = async (req, res) => {
    try{
        if(res.locals.user){
            const boards = await boardModel.find()
                                            .populate('user', ['email']);
            res.status(200).json({
                msg : "get boards",
                count : boards.length,
                boardData : boards.map((board, i) => {
                    return {
                        user : res.locals.user.email,
                        board : board.board
                    }
                })
            })    
        }
        else{
            return res.status(400).json({
                msg : err.message
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
board.get = async (req, res) => {
    const id = req.params.boardId;
    try{
        if(res.locals.user){
            const board = await boardModel.findById(id)
                                .populate('user', ['email']);
            if(!board){
                return res.status(400).json({
                    msg : "not boardId"
                })
            }
            else{
                res.status(200).json({
                    msg : "get board",
                    boardData : board
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
board.save = async (req, res) => {
    try{
        const newBoard = new boardModel({
                            user : res.locals.user.id,
                            board : req.body.board
                        });
        if(res.locals.user){
            const board = await newBoard.save();
            res.status(200).json({
                msg : "save board",
                boardData: board
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
board.update = async (req, res) => {
    const id = req.params.boardId;
    try{
        if(res.locals.user){
            const board = await boardModel.findByIdAndUpdate(id, {$set : {
                                user : res.locals.user.id,
                                board : req.body.board
                            }});
            if(!board){
                return res.status(400).json({
                    msg : "not boardId"
                })
            }
            else{
                res.status(200).json({
                    msg : 'update board by id: ' + id
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
board.deleteAll = async (req, res) => {
    try{
        if(res.locals.user){
            await boardModel.remove();
            res.status(200).json({
                msg : "delete boards"
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
board.delete = async (req, res) => {
    const id = req.params.boardId;
    try{
        if(res.locals.user){
            const board = await boardModel.findByIdAndRemove(id);
            if(!board){
                return res.status(400).json({
                    msg : "not boardId"
                })
            }   
            else{
                res.status(200).json({
                    msg : "delete board by id: " + id
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

module.exports = board;