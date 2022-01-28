const logger = require("../utils/logger");
module.exports.requestLoggerMiddleware = function (req, res, next) {
    logger.logInfo(`Request type ${req.method}`);
    logger.logInfo(`Request url: ${req.url}`);
    next();
}