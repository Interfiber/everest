const user = require("../db/user");
// Check if the auth token in the request is valid
module.exports.authTokenMiddleware = async function (req, res, next){
    const token = req.body.authToken;
    if (token == undefined){
        res.status(400).json({
            message: "Failed to update",
            error: true,
            errorLog: "Token does not exist!"
        });
        return;
    } else {
        const authTokenStatus = await user.authTokenExists(token);
        if (!authTokenStatus){
            res.status(401).json({
                message: "Failed to update",
                error: true,
                errorLog: "auth token invalid!"
            });
        } else {
            next();
        }
    }
}