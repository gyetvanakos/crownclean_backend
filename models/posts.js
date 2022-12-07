const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let postSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true},
        picture_url: { type: String },
        date: { type: Date, default: Date.now },
        
    }  
);

module.exports = mongoose.model("posts", postSchema);