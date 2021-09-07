// #region Modules
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const path = require("path");

const config = require("./config/config");
const morgan = require("./config/morgan");
const logger = require("./config/logger");
const session = require("./config/session");
const { jwtStrategy } = require("./config/passport");
const { error } = require("./middlewares");
// const routes = require("./routes");
// #endregion

/**
 * Express instance
 * @public
 */
const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// request logging with morgan
if (config.env !== "test") {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}

// set security HTTP headers with helmet
app.use(helmet());

//#region parse request body
// parse json request body
app.use(
	express.json({
		limit: "1mb"
	})
);

// parse raw request body
app.use(
	express.raw({
		limit: "1mb"
	})
);

// parse text request body
app.use(
	express.text({
		limit: "1mb"
	})
);

// parse urlencoded request body
app.use(express.urlencoded({ limit: "1mb" }));
// #endregion

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.options("*", cors());

// trust first proxy
app.set("trust proxy", 1);
app.use(session);

// enable authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// enable static files access
app.use(
	"/static",
	express.static(path.join(__dirname, "../public"), { dotfiles: "deny" })
);

// API routes
// app.use("/", routes);

// #region Errors
// Catch 404 and forward to error handler
app.use(error.notFound);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// error handler
app.use(error.handler);
// #endregion

module.exports = app;
