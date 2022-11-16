const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const yaml = require('yamljs');
const { TokenExpiredError } = require("jsonwebtoken");

require("dotenv-flow").config();

app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

app.use(function (req, res, next) {
 res.header("Access-Control-Allow-Origin", "*")
 res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept")
 res.header("Access-Control-Allow-Method", "GET, HEAD, OPTION, POST, PUT, DELETE");
 next();
})


mongoose.connect(
process.env.DBHOST,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch (error => console.log ("Can't connect" + error));

mongoose.connection.once("open", () => console.log("Connected to mongodb"));



//routes
app.get("/api/welcome", (req, res) => {
    res.status(200).send({ message: "Welcome"});
})

app.use("/api/posts", postRoutes);
app.use("/api/users", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, function(){
    console.log("Server is running on port:" + PORT);
})

module.exports = app;