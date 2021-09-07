const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const { v4: uuidv4 } = require("uuid");

const { name } = require("../../package.json");
const { secretSession } = require("./config");

module.exports = session({
	name,
	secret: secretSession,
	resave: false,
	saveUninitialized: true,
	// eslint-disable-next-line no-unused-vars
	genid: req => {
		return uuidv4(); // use UUIDs for session IDs
	},
	cookie: {
		secure: true,
		maxAge: 86400000
	},
	store: new MemoryStore({
		checkPeriod: 86400000 // prune expired entries every 24h
	})
});
