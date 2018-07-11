var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser")
    app = express();

app.use(express.static(__dirname + "/client"));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/snake');

var ScoreSchema = mongoose.Schema({
    player: String,
    score: Number
});

var Score = mongoose.model("Score", ScoreSchema);

http.createServer(app).listen(3000);

