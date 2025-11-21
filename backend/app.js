const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require('cors');

const path = require("path");
const moviesRouter = require("./Routes/moviesRoutes");
const authRouter = require("./Routes/authRouter");
const userRouter = require("./Routes/userRoute");
const CustomError = require("./Utils/CustomError");
const globalErrorHandler = require("./Controllers/errorController"); // ✅ FIXED HERE

const app = express();

// cors
const allowedOrigins = [
  "http://localhost:5173",
  "https://cineflix-mern-movie-app.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.options("/api/*", cors());




app.use(helmet());



const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many requests from this IP. Please try after one hour.",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

//app.use(sanitize());
//app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratings",
      "releaseYear",
      "releaseDate",
      "genres",
      "directors",
      "actors",
      "price",
    ],
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

// ROUTES
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// 404 HANDLER
app.use((req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on this server`,
    404
  );
  next(err);
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
