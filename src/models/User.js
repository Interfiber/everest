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
// userScheme methods
userSchema.methods.setOnlineStatus = function (status){
    this.online = status;
}

module.exports.User = mongoose.model("User", userSchema);