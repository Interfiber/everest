const AUTH_TOKEN_LENGTH = 25;
const SALT_ROUNDS = 10;

// modules
const bcrypt = require("bcrypt");
const nanoid = require("nanoid");

module.exports.hashPassword = async function (input){
    // generate the salt
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    // hash the password
    const result = await bcrypt.hash(input, salt);
    return result;
}
module.exports.genAuthToken = function (){
    return nanoid.nanoid(AUTH_TOKEN_LENGTH);
}
module.exports.checkHashedPassword = async function (hashed, raw){
    const checkResult = await bcrypt.compare(raw, hashed);
    return checkResult;
}