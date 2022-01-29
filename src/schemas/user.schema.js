const Ajv = require("ajv")
module.exports.UserRequestSchema = {
    type: "object",
    properties: {
        username: { type: "string" },
        password: { type: "string" }
    },
    required: ["username", "password"],
    additionalProperties: false
};