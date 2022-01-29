const express = require("express");
const requestLogger = require("./middlewares/requestLogger.middleware");
const rateLimit = require('express-rate-limit');
const app = express();
const PORT = process.env.PORT || 3030;
const userLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: JSON.stringify({
    message: "Too many API requests!",
    error: true,
    errorLog: "5 requests to the /api/v1/users are allowed every 5 mins"
  })
})

// routes & middlewares
app.use(express.json());
app.use(requestLogger.requestLoggerMiddleware);
// user api limiter
app.use("/api/v1/users", userLimiter);
app.use("/api/v1/users", require("./routes/users.api"));
app.use(express.static("./public"));


app.listen(PORT, () => {
    console.log(`Open on port: ${PORT}`);
})
