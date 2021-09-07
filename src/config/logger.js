const winston = require("winston");
require("winston-daily-rotate-file");

const colors = require("colors/safe");

const config = require("./config");
const { capitalize } = require("../utils/strings");

// #region Custom formats
const enumerateErrorFormat = winston.format(info => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}

	return info;
});

if (config.env === "development") {
	colors.enabled = true;
}

const timestampColorize = winston.format((info, opts) => {
	if (config.env === "development") {
		let color = colors.cyan;

		if (opts) {
			if (opts.color && colors[opts.color]) {
				color = colors[opts.color];
			}

			if (opts.background) {
				const bg = `bg${capitalize(opts.background)}`;

				if (colors[bg]) {
					color = color[bg];
				}
			}

			if (opts.bold) {
				color = color.bold;
			}
		}

		Object.assign(info, { timestamp: color(info.timestamp) });
	}

	return info;
});

const levelColorize = winston.format((info, opts) => {
	let color = colors.white;

	// eslint-disable-next-line default-case
	switch (info.level) {
		case "debug":
			color = colors.bgBlue.bold;
			break;
		case "info":
			color = color.bgGreen.bold;
			break;
		case "warn":
			color = colors.bgYellow.bold;
			break;
		case "error":
			color = colors.bgRed.bold;
			break;
	}

	Object.assign(info, { level: color(info.level) });

	return info;
});

const splatColorize = winston.format((info, opts) => {
	if (config.env === "development") {
		const color = colors.brightYellow;
		const SPLAT = Symbol.for("splat");

		if (info[SPLAT] && info[SPLAT].length > 0) {
			info[SPLAT].forEach(item => {
				Object.assign(info, {
					message: info.message.replace(
						// eslint-disable-next-line security/detect-non-literal-regexp
						new RegExp(item, "g"),
						color.inverse(item)
					)
				});
			});
		}
	}

	return info;
});
// #endregion

const logger = winston.createLogger({
	level: config.env === "development" ? "debug" : "info",
	format: winston.format.combine(
		winston.format.align(),
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
		winston.format.splat(),
		enumerateErrorFormat(),
		timestampColorize({ bold: true }),
		config.env === "development"
			? levelColorize()
			: winston.format.uncolorize(),
		splatColorize(),
		winston.format.printf(({ level, message, timestamp }) => {
			return `${timestamp} ${level}: ${message}`;
		})
	),
	transports: [
		new winston.transports.Console({
			stderrLevels: ["error"],
			consoleWarnLevels: ["warn", "notice"]
		})
	]
});

if (config.env === "production") {
	logger.add(
		new winston.transports.DailyRotateFile({
			dirname: "./logs",
			filename: "combined-%DATE%.log",
			datePattern: "YYYY-MM-DD",
			zippedArchive: true,
			maxSize: "20m",
			maxFiles: "14d"
		})
	);
	logger.add(
		new winston.transports.DailyRotateFile({
			level: "error",
			dirname: "./logs",
			filename: "error-%DATE%.log",
			datePattern: "YYYY-MM-DD",
			zippedArchive: true,
			maxSize: "20m",
			maxFiles: "14d"
		})
	);
}

logger.stream = {
	write: message => {
		logger.info(message.trim());
	}
};

module.exports = logger;
