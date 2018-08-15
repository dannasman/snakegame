var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    nconf = require("nconf"),
    app = express();

app.use(express.static(__dirname + "/client"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

nconf.argv().env().file("keys.json");

const user = nconf.get("mongoUser");
const pass = nconf.get("mongoPass");
const host = nconf.get("mongoHost");
const port = nconf.get("mongoPort");
const database = nconf.get("mongoDatabase")

let uri = `mongodb://${user}:${pass}@${host}:${port}/${database}`;

mongoose.connect(uri, { useNewUrlParser: true });

var scoreSchema = mongoose.Schema({
    singleScore: Number
});

var ScoreModel = mongoose.model("ScoreModel", scoreSchema);

http.createServer(app).listen(8080);

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