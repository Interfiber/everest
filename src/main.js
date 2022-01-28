const express = require("express");
const requestLogger = require("./middlewares/requestLogger.middleware");
const app = express();
const PORT = process.env.PORT || 3030;

// routes & middlewares
app.use(express.json());
app.use(requestLogger.requestLoggerMiddleware);
app.use("/api/v1/users", require("./routes/users.api"));
app.use(express.static("./public"));


app.listen(PORT, () => {
    console.log(`Open on port: ${PORT}`);
})