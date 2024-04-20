import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    original: {type: String, unique: true, required: true},
    shortened: {type: String, unique: true, required: true},
    isSafe: {type: Boolean, required: true},
    users: {type: Number}
});

const linkModel = mongoose.model("link", linkSchema);

export default linkModel;