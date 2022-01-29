const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    creationDate: String,
    cabinId: String,
    iconUrl: String,
    members: Array,
    ownerUsername: String,
    textChannels: Array,
    voiceChannels: Array
});

module.exports.Room = mongoose.model("Room", userSchema);