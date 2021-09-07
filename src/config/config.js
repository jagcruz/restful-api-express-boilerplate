const path = require("path");
const Joi = require("joi");

require("dotenv-safe").config({
	path: path.join(__dirname, "../../.env"),
	sample: path.join(__dirname, "../../.env.example"),
	allowEmptyValues: false
});

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string()
			.valid("production", "development", "test")
			.required(),
		PORT: [Joi.number().default(3000), Joi.string().default("3000")],
		SECRET_SESSION: Joi.string()
			.required()
			.description(
				"This is the secret used to sign the session ID cookie"
			),
		JWT_SECRET: Joi.string().required().description("JWT secret key"),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
			.default(30)
			.description("minutes after which access tokens expire"),
		JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
			.default(30)
			.description("days after which refresh tokens expire"),
		JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
			.default(10)
			.description("minutes after which reset password token expires"),
		JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
			.default(10)
			.description("minutes after which verify email token expires")
	})
	.unknown();

const { value: envVars, error } = envVarsSchema
	.prefs({
		errors: { label: "key" }
	})
	.validate(process.env);

if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
	env: envVars.NODE_ENV,
	port: envVars.PORT,
	secretSession: envVars.SECRET_SESSION,
	jwt: {
		secret: envVars.JWT_SECRET,
		accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
		refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
		resetPasswordExpirationMinutes:
			envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
		verifyEmailExpirationMinutes:
			envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
	}
};
