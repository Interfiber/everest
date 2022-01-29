const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    authToken: String,
    linkedAccounts: Array,
    online: Boolean,
    statusText: String,
    avatarUrl: String,
    bannerUrl: String
});


module.exports.User = mongoose.model("User", userSchema);