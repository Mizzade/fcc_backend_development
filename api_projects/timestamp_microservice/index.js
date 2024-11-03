// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get('/api', function( _, res) {
  res.json({
    unix: new Date().getTime(),
    utc: new Date().toUTCString()
  })
});

app.get("/api/:date",
  function(req, _, next) {
    req.result = {
      error: "Invalid Date"
    };

    next();
  },
  function(req, _, next) {
    if (isValidDateString(req.params.date)) {
      const date = new Date (req.params.date);

      req.result = {
        unix: date.getTime(),
        utc: date.toUTCString()
      }
    }

    next();
  },
  function(req, _, next) {
    if (isValidUnixTimesamp(req.params.date)) {
      const date = timestampToDate(req.params.date);

      req.result = {
        unix: date.getTime(),
        utc: date.toUTCString()
      }
    }

    next();
  },
  function(req, res) {
    res.json(req.result);
  }
);

const isValidDateString = (dateStr) => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

const isValidUnixTimesamp = (timestamp) => {
    if (!/^\d+$/.test(timestamp)) return false;

    // Convert to a number and check if it represents a valid date
    const date = new Date(parseInt(timestamp, 10));
    return date.getTime() > 0 && !isNaN(date.getTime());
}

const timestampToDate = (timestamp) => new Date(parseInt(timestamp, 10));


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
