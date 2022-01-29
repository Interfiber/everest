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
module.exports.OnlineUpdateRequestSchema = {
    type: "object",
    properties: {
        authToken: { type: "string" },
        online: { type: "boolean" }
    },
    required: ["authToken", "online"],
    additionalProperties: false
}