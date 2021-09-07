const httpStatus = require("http-status");
const createError = require("http-errors");
const expressValidation = require("express-validation");

const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const logger = require("../config/logger");

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err, req, res, next) => {
	const response = {
		status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
		message: err.message || httpStatus[err.status],
		stack: err.stack.split("\n")
	};

	if (config.env !== "development") {
		delete response.stack;
	}

	res.locals.message = response.message;
	res.locals.error = config.env === "development" ? err : {};

	// logger.error(err);
	res.status(response.status).json(response);
};

/**
 * If error is not an instanceOf ApiError, convert it.
 * @public
 */
const converter = (err, req, res, next) => {
	let convertedError = err;

	if (err instanceof expressValidation.ValidationError) {
		convertedError = new ApiError(
			err.status,
			"Validation Error",
			err.stack
		);
	} else if (createError.isHttpError(err)) {
		convertedError = new ApiError(err.statusCode, err.message, err.stack);
	} else if (!(err instanceof ApiError)) {
		convertedError = new ApiError(err.status, err.message, err.stack);
	}

	next(convertedError);
};

/**
 * Catch 404 and forward to next error handler
 * @public
 */
const notFound = (req, res, next) => {
	next(createError(httpStatus.NOT_FOUND));
};

module.exports = {
	handler,
	converter,
	notFound
};

//#region
const errorConverter = (err, req, res, next) => {
	let error = err;

	if (!(error instanceof ApiError)) {
		const statusCode = error.statusCode
			? httpStatus.BAD_REQUEST
			: httpStatus.INTERNAL_SERVER_ERROR;

		const message = error.message || httpStatus[statusCode];

		error = new ApiError(statusCode, message, err.stack);
	}
	logger.error("error,js");
	next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
	logger.error(">>error,js");
	let { statusCode, message } = err;

	if (config.env === "production" && !err.isOperational) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
	}

	res.locals.errorMessage = err.message;

	const response = {
		code: statusCode,
		message,
		...(config.env === "development" && { stack: err.stack })
	};

	if (config.env === "development") {
		logger.error(err);
	}

	res.status(statusCode).send(response);
};

/* module.exports = {
	errorConverter,
	errorHandler
};*/
//#endregion
