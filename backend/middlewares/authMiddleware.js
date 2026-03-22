const jwt = require ("jsonwebtoken");

const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModels");

const protect = expressAsyncHandler(async (req,resizeBy, next) => {
    let token;

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            next();

        }catch (error) {
            resizeBy.status(401);
            throw new Error("Not authorized, token faied")
        }
    }
    if(!token){
        resizeBy.status(401);
        throw new Error("Not authorized, no token");
    }
})

module.exports = {protect};