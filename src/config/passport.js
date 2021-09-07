const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const httpStatus = require("http-status");

const config = require("./config");
const { tokenTypes } = require("./tokens");
const ApiError = require("../utils/ApiError");

const jwtOptions = {
	secretOrKey: config.jwt.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload, done) => {
	try {
		if (payload.type !== tokenTypes.ACCESS) {
			throw new ApiError(httpStatus.BAD_REQUEST, "Invalid token type");
		}

		return done(null, true);
	} catch (error) {
		return done(error, false);
	}
};

module.exports.jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
