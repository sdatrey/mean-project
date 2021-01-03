const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
        console.log(decodedToken);
        req.userData = decodedToken;
        next();
    }
    catch (error){
        res.status(401).json({
            message: 'You are not authenticated'
        })
    }
}
