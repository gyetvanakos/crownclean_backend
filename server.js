const express = require("express");
const mongoose= require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");

require("dotenv-flow").config();

app.use(bodyParser.json());

mongoose.connect(
    process.env.DBHOST,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log("Error connecting to db:"+ error));

mongoose.connection.once('open', () => console.log('Connected to db'));

app.use("/api/posts", postRoutes);
app.use("/api/user", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, function() {
    console.log("Server is running on port: " + PORT)
});

module.exports = app;