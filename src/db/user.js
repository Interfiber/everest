// Modules
const { User } = require("../models/User");
const userUtils = require("../utils/user"); 
// Connect to the database
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/everest');

// Check if a user exists
module.exports.userExists = async function (username) {
    const user = await this.getUser(username);
    if (user == null){
        return false;
    } else {
        return true;
    }
}

// Get a user from the database
module.exports.getUser = async function (usrname){
    const userModel = await mongoose.model("User").findOne({ username: usrname }).exec();
    return userModel;
}


// Create a user
module.exports.createUser = async function (usrname, passwd){
    // Check if the instance owner has locked account signup
    if (instanceConfig.config.lockAccountSignup){
        res.json({
            messaged: "Account signups are locked",
            user: null,
            errorLog: "instanceConfig.config.lockAccountSignup = true",
            error: true
        }).status(401);
        return;
    }
    // Check if user exists
    if (await this.userExists(usrname)){
        // user exists, throw error
        return {
            error: true,
            errorLog: "Username already taken!",
            authToken: null
        };
    }
    // hash password
    const hashedPassword = await userUtils.hashPassword(passwd);
    // get auth token
    const authToken = userUtils.genAuthToken();
    // create the user object
    let userObject = new User({
        username: usrname,
        password: hashedPassword,
        authToken: authToken,
        linkedAccounts: [],
        online: false,
        statusText: null,
        avatarUrl: null,
        bannerUrl: null
    });
    // save user object
    await userObject.save();
    return {
        error: false,
        authToken: authToken
    }
}

// Login a user
module.exports.loginUser = function (username, password){
    const user = this.getUser(username);
    if (user == null){
     return false;
    }
}