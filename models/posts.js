const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let postSchema = new Schema(
    {
        title: { type: String, required: true, minlength: 4, maxlength: 50 },
        content: { type: String, required: true},
        date: { type: Date, default: Date.now },
        pictures_url: [{ type: String }]
    }  
);

module.exports = mongoose.model("posts", postSchema);