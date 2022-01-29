const express = require('express');
const { UserRequestSchema, OnlineUpdateRequestSchema } = require("../schemas/user.schema");
const userDatbase = require("../db/user");
const { validate } = require("../utils/schema");
const authMiddlewares = require("../middlewares/auth.middleware");
const router = express.Router();
router.use("/setonline", authMiddlewares.authTokenMiddleware);
// Create user route
router.post("/create", async (req, res) => {
    const validateStatus = validate(UserRequestSchema, req.body);
    if (!validateStatus){
        res.status(400).json({
            message: "Malformed request",
            user: null,
            error: true
        });
    } else {
        // Create the user, and get the auth token for that user
        const user = await userDatbase.createUser(req.body.username, req.body.password);
        if (user.error == true){
            res.status(user.httpStatus).json({
                message: "User creation attempt failed!",
                user: null,
                error: true,
                errorLog: user.errorLog
            })
        } else {
            res.json({
                message: "Created User",
                user: {
                    authToken: user.authToken
                },
                error: false
            })
        }
    }
});
// Login user route
router.post("/login", async (req, res) => {
    const validateStatus = validate(UserRequestSchema, req.body);
    if (!validateStatus){
        res.json({
            message: "Malformed request",
            user: null,
            error: true
        }).status(400);
    }
    // attempt to login the user, and get there auth token
    const user = await userDatbase.loginUser(req.body.username, req.body.password);
    // If the login request succeeded send the client the auth token
    if (user.error){
        res.status(user.httpStatus).json({
            message: "Login attempt failed!",
            errorLog: user.errorLog,
            error: true,
            authToken: null
        })
    } else {
        res.json({
            message: "Login attempt succeeded!",
            error: false,
            authToken: user
        })
    }
});
// Set the online status of a user
// Note: This route is protected by the auth middleware.
router.post("/setonline", async (req, res) => {
    const validateStatus = validate(OnlineUpdateRequestSchema, req.body);
    if (!validateStatus){
        res.json({
            message: "Malformed request",
            user: null,
            error: true
        }).status(400);
        return;
    }
    // We know this will not be null because the middleware succeeded finding the token owner
    const tokenOwner = await userDatbase.authTokenInfo(req.body.authToken);
    const result = await userDatbase.updateUserOnline(tokenOwner.username, req.body.online);
    res.json(result);
});

module.exports = router;
