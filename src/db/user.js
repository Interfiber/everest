// Modules
const { User } = require("../models/User");
const userUtils = require("../utils/user"); 
const instanceConfig = require("../config/instanceConfig");
// Connect to the database
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/everest');

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
        return {
            error: true,
            errorLog: "Account signup is locked!",
            authToken: null
        }
    }
    // Check if the data is null
    if (usrname.trim().length == 0 || passwd.trim().length == 0){
        return {
            error: true,
            errorLog: "Empty username, or password",
            httpStatus: 400,
            authToken: null
        }
    }
    // Check if user exists
    if (await this.userExists(usrname)){
        // user exists, throw error
        return {
            error: true,
            errorLog: "Username already taken!",
            httpStatus: 409,
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
        errorLog: null,
        error: false,
        authToken: authToken
    }
}

// Login a user
module.exports.loginUser = async function (username, password){
    if (instanceConfig.config.lockAccountLogin){
        return {
            error: true,
            errorLog: "Account logins are locked",
            httpStatus: 403,
            authToken: null
        };
    }
    const user = await this.getUser(username);
    // Username is invalid
    if (user == null){
        return {
            error: true,
            httpStatus: 401,
            errorLog: "User does not exist",
            authToken: null
        };
    }
    // If the user exists, check the password with the one in the database with the one given by the user
    const passwordCheckResult = await userUtils.checkHashedPassword(user.password, password);
    if (passwordCheckResult){
        // If correct return the user auth token for the user
        return user.authToken;
    } else {
        // If not return a message
        return {
            error: true,
            httpStatus: 401,
            errorLog: "User does not exist",
            authToken: null
        };
    }
}