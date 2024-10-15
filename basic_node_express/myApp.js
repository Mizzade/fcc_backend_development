require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

console.log("Hello World");
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", function (req, _, next) {
  const { method, path, ip } = req;
  console.log(`${method} ${path} - ${ip}`);
  next();
});

app.get("/", function (_, res) {
  // res.send("Hello Express");
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/json", function (_, res) {
  const messageStyle = process.env.MESSAGE_STYLE;
  const message_ = "Hello json";
  const message =
    messageStyle === "uppercase" ? message_.toUpperCase() : message_;

  res.json({ message });
});

app.get(
  "/now",
  function (req, _, next) {
    req.time = new Date().toString();
    next();
  },
  function (req, res) {
    res.json({ time: req.time });
  }
);

app.get("/:word/echo", function (req, res) {
  res.json({ echo: req.params.word });
});

app.get("/name", function (req, res) {
  const { first, last } = req.query;
  res.json({ name: `${first} ${last}` });
});

app.post("/name", function (req, res) {
  const { first, last } = req.body;
  res.json({ name: `${first} ${last}` });
});

module.exports = app;
