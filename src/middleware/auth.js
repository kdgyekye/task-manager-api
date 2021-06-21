const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req,res,next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = jwt.verify(token,'t-m-user');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})
        
        if (!user) {
            throw new Error('Authentication Error')
        }
        
        req.profile = user;
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({error});
    }
}

module.exports = authMiddleware;