const jwt = require('jsonwebtoken');
const { secret } = require('./config');

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
};


const authenticateAdmin = (req, res, next) => { 
    const token = req.headers.authorization; 

    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' }); 
    }

    try {
        const decoded = jwt.verify(token, secret); 
        if (decoded.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin authorization required' }); 
        }
        next(); 

    } catch (error) {
        return res.status(401).json({ error: 'Invalid Token' }); 
    }
}



module.exports = { authenticateUser, authenticateAdmin };
