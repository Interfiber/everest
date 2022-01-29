const express = require('express');
const { UserRequestSchema, OnlineUpdateRequestSchema, TokenVerifyRequestSchema } = require("../schemas/user.schema");
const userDatabase = require("../db/user");
const { validate } = require("../utils/schema");
const authMiddlewares = require("../middlewares/auth.middleware");
const rateLimiter = require("express-rate-limit");
// Create the api limiter to protect specific routes
const userApiLimiter = rateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    message: JSON.stringify({
        message: "Rate Limited",
        error: true,
        errorLog: "This route is protected by the rate-limiter, every 5 mins you're computer can send 5 requests to protected routes."
    })
});
const router = express.Router();
// Setup middlewares

// Protect auth token required routes
router.use("/setonline", authMiddlewares.authTokenMiddleware);
router.use("/create", userApiLimiter);
router.use("/login", userApiLimiter);
// Apply the rate limiter to routes


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
        const user = await userDatabase.createUser(req.body.username, req.body.password);
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
    const user = await userDatabase.loginUser(req.body.username, req.body.password);
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
    const tokenOwner = await userDatabase.authTokenInfo(req.body.authToken);
    const result = await userDatabase.updateUserOnline(tokenOwner.username, req.body.online);
    res.json(result);
});

// Get the public info for a user
router.get("/info/:user", async (req, res) => {
    if (req.params.user == undefined){
        res.json({
            message: "Malformed request",
            user: null,
            error: true
        }).status(400);
        return;
    }
    const user = await userDatabase.getUser(req.params.user);
    if (user == null){
        res.status(404).json({
            message: "Invalid user",
            error: true,
            errorLog: "user not found"
        })
    } else {
        res.json({
            message: "Got user info",
            error: false,
            errorLog: null,
            user: {
                username: user.username,
                online: user.online,
                avatarUrl: user.avatarUrl,
                bannerUrl: user.bannerUrl,
                statusText: user.statusText,
                linkedAccounts: user.linkedAccounts
            }
        })
    }
});

router.post("/verifytoken", async (req, res) => {
    const validateStatus = validate(TokenVerifyRequestSchema, req.body);
    if (!validateStatus){
        res.status(400).json({
            message: "Malformed request",
            user: null,
            error: true
        });
        return;
    }
    const tokenStatus = await userDatabase.authTokenExists(req.body.authToken);
    if (tokenStatus){
        res.json({
            message: "Valid token",
            valid: true,
            error: false,
            errorLog: null
        })
    } else {
        res.json({
            message: "Invalid token",
            valid: false,
            error: true,
            errorLog: "Token is invalid!"
        })
    }
});

router.post("/tokenowner", async (req, res) => {
    const validateStatus = validate(TokenVerifyRequestSchema, req.body);
    if (!validateStatus){
        res.status(400).json({
            message: "Malformed request",
            user: null,
            error: true
        });
        return;
    }
    const user = await userDatabase.authTokenInfo(req.body.authToken);
    if (user == null){
        res.json({
            message: "Failed to get token owner",
            errorLog: "Database query returned null",
            error: true,
            owner: null
        });
        return;
    }
    res.json({
        message: "Got token owner",
        errorLog: null,
        error: false,
        owner: user.username
    })
});


module.exports = router;
