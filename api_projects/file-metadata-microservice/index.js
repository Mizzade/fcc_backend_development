import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
const upload = multer({ dest: "uploads/" });

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(process.cwd() + "/public"));

// Middleware
const validateFileUpload = (req, res, next) => {
  if (!req.file) return next(createError(ERR_NO_FILE_SELECTED));

  const { originalname, size, mimetype } = req.file;
  if (!originalname || !size || !mimetype)
    return next(createError(ERR_NO_FILE_SELECTED, 400));

  next();
};

const errorHandler = (err, req, res, next) => {
  if (res.headerSent) return next(err);
  return res
    .status(err.status || err.statusCode || 500)
    .json({ error: err.message || "Internal Server Error" });
};

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// route handler

app.post(
  "/api/fileanalyse",
  upload.single("upfile"),
  validateFileUpload,
  async (req, res) => {
    const { originalname, size, mimetype } = req.file;

    return res.send({
      name: originalname,
      type: mimetype,
      size,
    });
  }
);

// Error handling middleware (must be last)
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});

// Utils
const createError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

// Errors
const ERR_NO_FILE_SELECTED = "Error: No file selected";
