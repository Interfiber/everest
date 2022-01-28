const express = require('express');
const { UserRequestSchema } = require("../schemas/user.schema");
const instanceConfig = require("../config/instanceConfig");
const router = express.Router();

// Create user route
router.post("/create", async (req, res) => {
    const validateStatus = UserRequestSchema.validate(req.body);
    if (validateStatus.error != null){
        res.json({
            message: "Malformed request",
            user: null,
            errorLog: validateStatus.error,
            error: true
        }).status(400);
        return;
    }
    // Create the user, and get the auth token for that user
    const user = await require("../db/user").createUser(req.body.username, req.body.password);
    if (user.error == true){
        res.json({
            message: "Failed to create user",
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
});

module.exports = router;
