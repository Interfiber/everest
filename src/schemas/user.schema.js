const joi = require("joi");
module.exports.UserRequestSchema = joi.object({
    username: String,
    password: String
})