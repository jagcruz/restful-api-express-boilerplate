const { version, name, description } = require("../../package.json");
const config = require("../config/config");

const swaggerDef = {
	openapi: "3.0.0",
	info: {
		title: `${name} - API documentation`,
		description,
		version,
		license: {
			name: "MIT",
			url: "https://github.com/jagcruz/restful-api-express-boilerplate/blob/master/LICENSE"
		}
	},
	servers: [
		{
			url: `http://localhost:${config.port}`
		}
	]
};

module.exports = swaggerDef;
