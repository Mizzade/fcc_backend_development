import * as dotenv from 'dotenv'
import express from 'express';
import cors from 'cors'
const app = express();
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import { nanoid } from "nanoid";
import urlExist from 'url-exist';

dotenv.config();

// Basic Configuration
const port = process.env.PORT || 3000;

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(error => console.error("Connection error", error));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

// DB Schema & Models
const urlMappingSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true
  }
})

const UrlMapping = mongoose.model("UrlMapping", urlMappingSchema);


// DB functions
const findOneByUrl = async (url) => UrlMapping.findOne({ url })
const findOneByShortUrl = async (url) => UrlMapping.findOne({ shortUrl: url })
const create = async (url, shortUrl) => {
  const mapping = new UrlMapping({ url, shortUrl });
  return mapping.save();
}

// API
app.get('/', function (_, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl', async (req, res) => {
  const url = req.body.url;

  const isValidUrl = await urlExist(url)
  if (!isValidUrl) return res.json(errorObject);

  let searchResult = await findOneByUrl(url);

  if (searchResult) {
    return res.json({
      original_url: searchResult.url,
      short_url: searchResult.shortUrl
    })
  } else {
    const createResult = await create(url, nanoid(5));
    return res.json({
      original_url: createResult.url,
      short_url: createResult.shortUrl
    });
  }
});

app.get("/api/shorturl/:shorturl", async (req, res) => {
  const shortUrl = req.params.shorturl;
  const searchResult = await findOneByShortUrl(shortUrl);

  if (searchResult) {
    const url = searchResult.url
    return res.redirect(301, url);
  }

  return res.json(errorObject);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
