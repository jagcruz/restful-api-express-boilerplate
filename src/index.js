const http = require("http");
const config = require("./config/config");
const app = require("./app");
const logger = require("./config/logger");

const PORT = normalizePort(config.port || "3030");
app.set("port", PORT);

const server = http.createServer(app);
server.listen(PORT);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 * @param {Object} value
 * @returns {int|string|boolean}
 */
function normalizePort(value) {
	const port = parseInt(value, 10);

	if (Number.isNaN(port)) {
		return value; // named pipe
	}

	if (port >= 0) {
		return port; // port number
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 * @param {any} error
 * @returns {any}
 */
function onError(error) {
	logger.error("onError"); // FIXME Delete logger

	if (error.syscall !== "listen") {
		logger.error(error); // FIXME Delete logger
		exitHandler(1);
	}

	logger.error("onError Switch"); // FIXME Delete logger

	const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;

	// Handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			logger.error(`${bind} requires elevated privileges`);
			exitHandler(1);
			break;
		case "EADDRINUSE":
			logger.error(`${bind} is already in use`);
			exitHandler(1);
			break;
		default:
			logger.error(`Error code: ${error.code}`); // FIXME Delete logger
			logger.error(error);
			exitHandler(1);
	}
}

/**
 * Event listener for HTTP server "listening" event.
 * @returns {any}
 */
function onListening() {
	const addr = server.address();
	const bind =
		typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;

	logger.info(`Starting mode: %s`, config.env.toUpperCase());
	logger.info(`Platform: %s\t\tPID: %d`, process.platform, process.pid);
	logger.info(`Server started and listening to %s`, bind);
}

const exitHandler = (code = 0) => {
	if (server) {
		server.close(() => {
			logger.info(`Server closed [${code}]`);
			process.exit(code);
		});
	} else {
		process.exit(code);
	}
};
