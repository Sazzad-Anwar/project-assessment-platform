// @Description: All server running configuration is setting up here.
// @CreatedAt:
// @Author-name: Md. Sazzad Bin Anwar

const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const { join } = require("path");
const compression = require("compression");
const connectMongoDB = require("./config/db/MongoDB.js");
const { errorHandler, notFound } = require("./middlewares/errorHandler.js");
const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/usersRoute");
const assessmentRoute = require("./routes/assessmentRoute");
const { default: axios } = require("axios");
dotenv.config();

//This will show the request path for every request only for development mode
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("tiny"));
}

app.enable('trust proxy');
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "build")));

//@Description: To use monogdb connection
connectMongoDB();

//while starting the application automatic insert a super admin user
if (process.env.NODE_ENV !== "test") {
  axios
    .post(`${process.env.API_URL}/api/v1/auth/registration`, {
      name: "Admin",
      email: "admin@mail.com",
      phoneNumber: "01834123456",
      password: "admin123456",
      confirmPassword: "admin123456",
      role: "admin",
    })
    .then(({ data }) => console.log(data.message))
    .catch((err) => console.log(err.message));
}

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/assessments", assessmentRoute);
app.get("/api/v1/checkStatus", (req, res) =>
  res.json({ status: "Ok", host: req.hostname })
);

app.use(errorHandler);
app.use(notFound);

module.exports = app;
