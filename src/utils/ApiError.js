const httpStatus = require("http-status");

/**
 * Class representing an API error.
 * @extends Error
 */
class ApiError extends Error {
	/**
	 * Creates an API error.
	 * @param {number} status - HTTP status code of error
	 * @param {string} message - Error message
	 */
	constructor(
		status = httpStatus.INTERNAL_SERVER_ERROR,
		message = undefined,
		stack = ""
	) {
		super(message || httpStatus[status]);

		this.status = status;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

module.exports = ApiError;
