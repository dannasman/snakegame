var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();

app.use(express.static(__dirname + "/client"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/snake', {useNewUrlParser: true});

var scoreSchema = mongoose.Schema({
    singleScore: Number
});

var ScoreModel = mongoose.model("ScoreModel", scoreSchema);

http.createServer(app).listen(3000);

app.get("/scores.json", function (req, res) {
    ScoreModel.find({}, function (err, foundScores) {
        res.json(foundScores);
    });
});

app.post("/scores", function (req, res) {
    var newScore = new ScoreModel({ "singleScore": req.body.singleScore });
    newScore.save(function (err, result) {
        if (err !== null) {
            console.log(err);
            res.send("ERROR");
        } else {
            ScoreModel.find({}, function (err, result) {
                if (err !== null) {
                    res.send("ERROR");
                }
                res.json(result);
            });
        }
    });
});

console.log("servu on päällä");