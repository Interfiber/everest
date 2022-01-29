const Ajv = require("ajv")
const ajv = new Ajv()
module.exports.validate = function (schema, input){
    const valid = ajv.validate(schema, input)
    return valid
}