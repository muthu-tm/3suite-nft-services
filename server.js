import * as dotenv from "dotenv";
dotenv.config();

import db from "./db/index.js";
global.db = db;

import cors from "cors";
import helmet from "helmet";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import passport from "./lib/passport.js";
import Environment from "./lib/environment.js";
import routes from "./routes/index.js";

let app = express();
app.use(helmet());

// Enable corss origin - CORS, attach URL scheme
if (Environment.isDevelopment) {
  app.use(cors());
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/status", (req, res) => {
  const data = {
    message: "Ok",
    date: new Date(),
  };
  
  res.status(200).send({ status: true, data: data });
});

app.use("/v1", routes);

// error handlers
// catch 404 and forward to error handler
app.use(function (request, response, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, request, response, next) {
    console.log(err);
    return response.json({ status: false, message: err.message, err: err });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, request, response, next) {
    return response.status(404).json({ status: false, error: err.message });
  });
}

var port = process.env.PORT || "3000";
app.set("port", port);
app.listen(port, () => {
  console.log(`Lit server listening on port ${port}`);
});
