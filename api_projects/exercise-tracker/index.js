import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
const app = express();
import mongoose from "mongoose";

// Environment variable check
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Connection error", error));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Schemas
const exerciseSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => !isNaN(v) && v > 0,
      message: "Duration must be a postive number",
    },
  },
  date: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (value) =>
        value === undefined || !isNaN(new Date(value).getTime()),
      message: (props) => `${props.value} is not a valid date`,
    },
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
});

// Models
const Exercise = mongoose.model("exercise", exerciseSchema);
const User = mongoose.model("user", userSchema);

// Middleware
const validateLogsQuery = (req, _, next) => {
  const { from, to, limit } = req.query;
  if (from && !isValidDate(from))
    return next(createError(ERR_INVALID_PARAM_FROM, 400));
  if (to && !isValidDate(to))
    return next(createError(ERR_INVALID_PARAM_TO, 400));
  if (limit && !isPositiveNumber(limit))
    return next(createError(ERR_INVALID_PARAM_LIMIT, 400));
  next();
};

const validateQueryPostUsers = (req, res, next) => {
  const { username: username_ } = req.body;
  const username = username_.trim();

  if (!username) return next(createError(ERR_INVALID_USERNAME, 400));

  req.body.username = username;
  next();
};

app.get("/api/users", async (_, res) => {
  try {
    const users = await User.find({}).select(["username", "_id"]).exec();

    return res.send(users);
  } catch (err) {
    return next(createError(ERR_FETCHING_USERS_FAILED));
  }
});

app.post("/api/users", validateQueryPostUsers, async (req, res) => {
  const { username } = req.body;
  try {
    // check if username  already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return next(createError(ERR_EXISTS_USERNAME, 400));

    // create and save the new user
    const { _id } = await new User({ username }).save();
    return res.status(201).json({ username, _id });
  } catch (error) {
    return next(createError(ERR_USER_CREATION_FAILED));
  }
});

// Routes
app.post("/api/users/:_id/exercises", async (req, res) => {
  let { description, duration, date } = req.body;
  const { _id } = req.params;

  date = sanitizeDate(date);

  let user;
  try {
    user = await User.findById(_id);
  } catch (error) {
    return next(createError(ERR_FIND_USER));
  }

  let exercise;
  try {
    exercise = await new Exercise({
      username: user.username,
      description,
      duration,
      date,
    }).save();
  } catch (error) {
    return next(createError(ERR_EXERCISE_CREATION_FAILED));
  }

  return res.status(201).json({
    username: user.username,
    description,
    duration: Number(duration),
    date: exercise.date.toDateString(),
    _id,
  });
});

app.get("/api/users/:_id/logs", validateLogsQuery, async (req, res, async) => {
  const { _id } = req.params;
  let { from, to, limit } = req.query;

  let user;
  try {
    user = await User.findById(_id);
  } catch (err) {
    return next(createError(ERR_FIND_USER));
  }

  const { username } = user;
  let query = Exercise.find({ username });

  // Add `from` and `to` conditions if provided
  if (from) query = query.where("date").gte(new Date(from));
  if (to) query = query.where("date").lte(new Date(to));

  // Apply limit only if `limit` exist`
  if (limit) query = query.limit(Number(limit));

  let exercises;
  try {
    exercises = await query
      .select(["-_id", "-__v"])
      .transform((res) => res.map(dateToDateString))
      .exec();
  } catch (error) {
    return next(createError(ERR_FIND_USER_EXERCISES));
  }

  const count = exercises.length;

  return res.json({
    username,
    count,
    _id,
    log: exercises,
  });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  if (res.headerSent) return next(err);
  res
    .status(err.status || err.statusCode || 500)
    .json({ error: err.message || "Internal Server Error" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// Utils
const sanitizeDate = (date) => (date && date.trim() !== "" ? date : undefined);
const dateToDateString = (queryObject) => ({
  ...queryObject.toObject(),
  date: queryObject.date.toDateString(),
});
const isPositiveNumber = (value) => Number(value) > 0;
const isValidDate = (dateString) => {
  // Check if it matches the format YYYY-MM-DD
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!regex.test(dateString)) return false;

  // Parse the date
  const date = new Date(dateString);

  // Ensure the parsed date matches the input string (to catch invalid dates like 2024-02-30)
  const [year, month, day] = dateString.split("-").map(Number);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 && // Month is zero-based in JS
    date.getDate() === day
  );
};
const createError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

// Errors
const ERR_FIND_USER_EXERCISES =
  "An error occured while retrieving the user's exercises";
const ERR_INVALID_USERNAME = "Username is not valid";
const ERR_EXISTS_USERNAME = "Username already exists";
const ERR_USER_CREATION_FAILED = "An error occurred while creating the user";
const ERR_EXERCISE_CREATION_FAILED =
  "An error occured while creating an exercise";
const ERR_FETCHING_USERS_FAILED = "An error occurred while retrieving users.";
const ERR_FIND_USER = "Could not find user";
const ERR_INVALID_PARAM_FROM = "Invalid `from` parameter";
const ERR_INVALID_PARAM_TO = "Invalid `to` parameter";
const ERR_INVALID_PARAM_LIMIT = "Invalid `limit` parameter";
